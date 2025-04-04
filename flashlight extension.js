class AdvancedFlashlightExtension {
  constructor() {
    this.stream = null;
    this.videoTrack = null;
    this.flashInterval = null;
    this.isStrobing = false;
    this.stateQueue = Promise.resolve();
    this.hardwareBuffer = 50; // 硬件安全间隔
  }

  getInfo() {
    return {
      id: 'advancedFlashlight',
      name: '高级手电筒',
      blocks: [
        {
          opcode: 'toggle',
          blockType: Scratch.BlockType.COMMAND,
          text: '切换手电筒'
        },
        {
          opcode: 'strobe',
          blockType: Scratch.BlockType.COMMAND,
          text: '爆闪 间隔 [DELAY] 毫秒',
          arguments: {
            DELAY: {
              type: Scratch.ArgumentType.NUMBER,
              defaultValue: 100
            }
          }
        },
        {
          opcode: 'stopStrobe',
          blockType: Scratch.BlockType.COMMAND,
          text: '停止爆闪'
        },
        {
          opcode: 'getStatus',
          blockType: Scratch.BlockType.BOOLEAN,
          text: '手电筒状态'
        }
      ]
    };
  }

  async initialize() {
    if (!this.stream) {
      this.stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'environment',
          advanced: [{ torch: false }]
        }
      });
      [this.videoTrack] = this.stream.getVideoTracks();
    }
  }

  async setState(enable) {
    await this.stateQueue;
    this.stateQueue = this.videoTrack.applyConstraints({
      advanced: [{ torch: enable }]
    }).catch(console.error);
  }

  async toggle() {
    await this.initialize();
    const current = this.videoTrack.getSettings().torch || false;
    await this.setState(!current);
  }

  strobe(args) {
    const delay = Math.max(this.hardwareBuffer, Number(args.DELAY));
    this.stopStrobe();
    this.isStrobing = true;
    
    const workerCode = `
      let state = false;
      onmessage = (e) => {
        if (e.data === 'start') {
          const interval = setInterval(() => {
            postMessage(state = !state);
          }, ${delay});
          postMessage('ready');
        }
      };
    `;

    this.flashWorker = new Worker(
      URL.createObjectURL(new Blob([workerCode]))
    );

    this.flashWorker.onmessage = (e) => {
      if (e.data === 'ready') return;
      this.setState(e.data).catch(() => this.stopStrobe());
    };

    this.flashWorker.postMessage('start');
  }

  stopStrobe() {
    this.isStrobing = false;
    if (this.flashWorker) {
      this.flashWorker.terminate();
      this.flashWorker = null;
    }
    this.setState(false);
  }

  getStatus() {
    return this.videoTrack?.getSettings().torch || false;
  }
}

Scratch.extensions.register(new AdvancedFlashlightExtension());
