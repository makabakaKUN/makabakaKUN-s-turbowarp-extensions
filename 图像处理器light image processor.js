// Name: 简易图像处理器TurboWarp Image Processor
// ID: imageProcessor
// Description: 包含基础功能，懒人必备Advanced image processing tools for TurboWarp.
// License: MIT
// Author: makabakaKUN (https://space.bilibili.com/3546673299065588)

(function(Scratch) {
  'use strict';

  const ColorMode = {
    HEX: 'hex',
    RGB: 'rgb',
    HSL: 'hsl'
  };

  const DownloadFormat = {
    PNG: 'png',
    JPG: 'jpg',
    WEBP: 'webp'
  };

  class ImageProcessor {
    constructor() {
      this.images = [];
      this.currentImageIndex = -1;
      this.zipFiles = [];
      this.renderer = Scratch.vm.runtime.renderer;
    }

    getInfo() {
      return {
        id: 'imageProcessor',
        name: '图像处理器',
        color1: '#0d98ba',
        color2: '#0a7e8c',
        color3: '#065f73',
        blocks: [
          {
            opcode: 'openTutorial',
            blockType: Scratch.BlockType.COMMAND,
            text: '关注作者和教程'
          },
          "---",
          {
            opcode: 'loadImageFromUrl',
            blockType: Scratch.BlockType.COMMAND,
            text: '从网址 [URL] 加载图片',
            arguments: {
              URL: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'https://extensions.turbowarp.org/dango.png'
              }
            }
          },
          {
            opcode: 'loadImageFromLocal',
            blockType: Scratch.BlockType.COMMAND,
            text: '从本机加载图片'
          },
          {
            opcode: 'createImage',
            blockType: Scratch.BlockType.COMMAND,
            text: '创建图片 颜色 [COLOR] 透明度 [ALPHA] 宽度 [WIDTH] 高度 [HEIGHT]',
            arguments: {
              COLOR: {
                type: Scratch.ArgumentType.COLOR,
                defaultValue: '#ff0000'
              },
              ALPHA: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 255
              },
              WIDTH: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 100
              },
              HEIGHT: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 100
              }
            }
          },
          "---",
          {
            opcode: 'switchImage',
            blockType: Scratch.BlockType.COMMAND,
            text: '切换到第 [INDEX] 张图片',
            arguments: {
              INDEX: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 1
              }
            }
          },
          {
            opcode: 'deleteCurrentImage',
            blockType: Scratch.BlockType.COMMAND,
            text: '删除当前图片'
          },
          {
            opcode: 'copyCurrentImage',
            blockType: Scratch.BlockType.COMMAND,
            text: '复制当前图片'
          },
          "---",
          {
            opcode: 'getCurrentImageIndex',
            blockType: Scratch.BlockType.REPORTER,
            text: '当前图片'
          },
          {
            opcode: 'getImageCount',
            blockType: Scratch.BlockType.REPORTER,
            text: '图片总数'
          },
          {
            opcode: 'getImageWidth',
            blockType: Scratch.BlockType.REPORTER,
            text: '当前图片宽度'
          },
          {
            opcode: 'getImageHeight',
            blockType: Scratch.BlockType.REPORTER,
            text: '当前图片长度'
          },
          "---",
          {
            opcode: 'getPixelColor',
            blockType: Scratch.BlockType.REPORTER,
            text: '获取第 [INDEX] 张图片 x [X] y [Y] 的颜色的 [MODE]',
            arguments: {
              INDEX: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 1
              },
              X: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 0
              },
              Y: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 0
              },
              MODE: {
                type: Scratch.ArgumentType.STRING,
                menu: 'colorMode',
                defaultValue: ColorMode.HEX
              }
            }
          },
          {
            opcode: 'setPixelColor',
            blockType: Scratch.BlockType.COMMAND,
            text: '设置第 [INDEX] 张图片 x [X] y [Y] 颜色为 [COLOR] 透明度 [ALPHA]',
            arguments: {
              INDEX: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 1
              },
              X: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 0
              },
              Y: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 0
              },
              COLOR: {
                type: Scratch.ArgumentType.COLOR,
                defaultValue: '#ff0000'
              },
              ALPHA: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 255
              }
            }
          },
          "---",
          {
            opcode: 'rgbToHex',
            blockType: Scratch.BlockType.REPORTER,
            text: '将颜色 r [R] g [G] b [B] 转换为颜色代码',
            arguments: {
              R: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 255
              },
              G: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 0
              },
              B: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 0
              }
            }
          },
          {
            opcode: 'hslToHex',
            blockType: Scratch.BlockType.REPORTER,
            text: '将颜色 h [H] s [S] l [L] 转换为颜色代码',
            arguments: {
              H: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 0
              },
              S: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 100
              },
              L: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 50
              }
            }
          },
          "---",
          {
            opcode: 'downloadImage',
            blockType: Scratch.BlockType.COMMAND,
            text: '下载当前图片为 [NAME] 格式 [FORMAT]',
            arguments: {
              NAME: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: '图片'
              },
              FORMAT: {
                type: Scratch.ArgumentType.STRING,
                menu: 'downloadFormat',
                defaultValue: DownloadFormat.PNG
              }
            }
          },
          {
            opcode: 'addToZip',
            blockType: Scratch.BlockType.COMMAND,
            text: '将当前图片以 [NAME] 加入zip压缩包',
            arguments: {
              NAME: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: '图片'
              }
            }
          },
          {
            opcode: 'downloadZip',
            blockType: Scratch.BlockType.COMMAND,
            text: '下载压缩包'
          },
          {
            opcode: 'clearZip',
            blockType: Scratch.BlockType.COMMAND,
            text: '清空压缩包'
          },
          "---",
          {
            opcode: 'showImageOnSprite',
            blockType: Scratch.BlockType.COMMAND,
            text: '让角色显示第 [INDEX] 张图片',
            arguments: {
              INDEX: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 1
              }
            }
          },
          {
            opcode: 'restoreOriginalCostume',
            blockType: Scratch.BlockType.COMMAND,
            text: '让角色恢复原有造型'
          }
        ],
        menus: {
          colorMode: {
            acceptReporters: true,
            items: [
              {text: '颜色代码', value: ColorMode.HEX},
              {text: 'r', value: 'r'},
              {text: 'g', value: 'g'},
              {text: 'b', value: 'b'},
              {text: 'h', value: 'h'},
              {text: 's', value: 's'},
              {text: 'l', value: 'l'},
              {text: '透明度', value: 'a'}
            ]
          },
          downloadFormat: {
            acceptReporters: true,
            items: [
              {text: 'PNG', value: DownloadFormat.PNG},
              {text: 'JPG', value: DownloadFormat.JPG},
              {text: 'WEBP', value: DownloadFormat.WEBP}
            ]
          }
        }
      };
    }

    openTutorial() {
      window.open('https://space.bilibili.com/3546673299065588', '_blank');
    }

    async loadImageFromUrl(args) {
      const url = Scratch.Cast.toString(args.URL);
      try {
        const response = await Scratch.fetch(url);
        if (!response.ok) return -1;

        const blob = await response.blob();
        const imageUrl = URL.createObjectURL(blob);
        const image = await this._loadImageElement(imageUrl);
        URL.revokeObjectURL(imageUrl);

        if (!image) return -1;

        const canvas = document.createElement('canvas');
        canvas.width = image.width;
        canvas.height = image.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(image, 0, 0);

        const imageData = {
          canvas: canvas,
          width: image.width,
          height: image.height,
          imageData: ctx.getImageData(0, 0, image.width, image.height)
        };

        this.images.push(imageData);
        this.currentImageIndex = this.images.length - 1;
        return this.currentImageIndex + 1;
      } catch (e) {
        console.error('Error loading image from URL:', e);
        return -1;
      }
    }

    loadImageFromLocal() {
      return new Promise((resolve) => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        
        input.onchange = async (e) => {
          const file = e.target.files[0];
          if (!file) return resolve(-1);

          try {
            const imageUrl = URL.createObjectURL(file);
            const image = await this._loadImageElement(imageUrl);
            URL.revokeObjectURL(imageUrl);

            if (!image) return resolve(-1);

            const canvas = document.createElement('canvas');
            canvas.width = image.width;
            canvas.height = image.height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(image, 0, 0);

            const imageData = {
              canvas: canvas,
              width: image.width,
              height: image.height,
              imageData: ctx.getImageData(0, 0, image.width, image.height)
            };

            this.images.push(imageData);
            this.currentImageIndex = this.images.length - 1;
            resolve(this.currentImageIndex + 1);
          } catch (e) {
            console.error('Error loading local image:', e);
            resolve(-1);
          }
        };

        input.click();
      });
    }

    createImage(args) {
      const color = Scratch.Cast.toString(args.COLOR);
      const alpha = Math.max(0, Math.min(255, Math.round(Scratch.Cast.toNumber(args.ALPHA))));
      const width = Math.max(1, Math.min(4096, Math.round(Scratch.Cast.toNumber(args.WIDTH))));
      const height = Math.max(1, Math.min(4096, Math.round(Scratch.Cast.toNumber(args.HEIGHT))));

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');

      // Parse hex color
      const r = parseInt(color.slice(1, 3), 16);
      const g = parseInt(color.slice(3, 5), 16);
      const b = parseInt(color.slice(5, 7), 16);

      ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${alpha / 255})`;
      ctx.fillRect(0, 0, width, height);

      const imageData = {
        canvas: canvas,
        width: width,
        height: height,
        imageData: ctx.getImageData(0, 0, width, height)
      };

      this.images.push(imageData);
      this.currentImageIndex = this.images.length - 1;
      return this.currentImageIndex + 1;
    }

    switchImage(args) {
      const index = Math.max(1, Math.min(this.images.length, Math.round(Scratch.Cast.toNumber(args.INDEX)))) - 1;
      if (index >= 0 && index < this.images.length) {
        this.currentImageIndex = index;
      }
    }

    deleteCurrentImage() {
      if (this.currentImageIndex >= 0 && this.currentImageIndex < this.images.length) {
        this.images.splice(this.currentImageIndex, 1);
        this.currentImageIndex = Math.min(this.currentImageIndex, this.images.length - 1);
      }
    }

    copyCurrentImage() {
      if (this.currentImageIndex >= 0 && this.currentImageIndex < this.images.length) {
        const original = this.images[this.currentImageIndex];
        
        const canvas = document.createElement('canvas');
        canvas.width = original.width;
        canvas.height = original.height;
        const ctx = canvas.getContext('2d');
        ctx.putImageData(original.imageData, 0, 0);

        const copy = {
          canvas: canvas,
          width: original.width,
          height: original.height,
          imageData: ctx.getImageData(0, 0, original.width, original.height)
        };

        this.images.push(copy);
        this.currentImageIndex = this.images.length - 1;
      }
    }

    getCurrentImageIndex() {
      return this.currentImageIndex + 1;
    }

    getImageCount() {
      return this.images.length;
    }

    getImageWidth() {
      if (this.currentImageIndex >= 0 && this.currentImageIndex < this.images.length) {
        return this.images[this.currentImageIndex].width;
      }
      return 0;
    }

    getImageHeight() {
      if (this.currentImageIndex >= 0 && this.currentImageIndex < this.images.length) {
        return this.images[this.currentImageIndex].height;
      }
      return 0;
    }

    getPixelColor(args) {
      const index = Math.max(1, Math.min(this.images.length, Math.round(Scratch.Cast.toNumber(args.INDEX)))) - 1;
      const x = Math.round(Scratch.Cast.toNumber(args.X));
      const y = Math.round(Scratch.Cast.toNumber(args.Y));
      const mode = Scratch.Cast.toString(args.MODE);

      if (index < 0 || index >= this.images.length) return '';
      
      const image = this.images[index];
      if (x < 0 || x >= image.width || y < 0 || y >= image.height) return '';

      // Convert from bottom-left origin to top-left origin
      const canvasY = image.height - 1 - y;
      const pixelIndex = (canvasY * image.width + x) * 4;
      
      const r = image.imageData.data[pixelIndex];
      const g = image.imageData.data[pixelIndex + 1];
      const b = image.imageData.data[pixelIndex + 2];
      const a = image.imageData.data[pixelIndex + 3];

      switch (mode) {
        case ColorMode.HEX:
          return `#${this._componentToHex(r)}${this._componentToHex(g)}${this._componentToHex(b)}`;
        case 'r': return r;
        case 'g': return g;
        case 'b': return b;
        case 'a': return a;
        case 'h':
        case 's':
        case 'l':
          const hsl = this._rgbToHsl(r, g, b);
          return hsl[mode === 'h' ? 0 : (mode === 's' ? 1 : 2)];
        default:
          return '';
      }
    }

    setPixelColor(args) {
      const index = Math.max(1, Math.min(this.images.length, Math.round(Scratch.Cast.toNumber(args.INDEX)))) - 1;
      const x = Math.round(Scratch.Cast.toNumber(args.X));
      const y = Math.round(Scratch.Cast.toNumber(args.Y));
      const color = Scratch.Cast.toString(args.COLOR);
      const alpha = Math.max(0, Math.min(255, Math.round(Scratch.Cast.toNumber(args.ALPHA))));

      if (index < 0 || index >= this.images.length) return;
      
      const image = this.images[index];
      if (x < 0 || x >= image.width || y < 0 || y >= image.height) return;

      // Convert from bottom-left origin to top-left origin
      const canvasY = image.height - 1 - y;
      const pixelIndex = (canvasY * image.width + x) * 4;
      
      // Parse hex color
      const r = parseInt(color.slice(1, 3), 16);
      const g = parseInt(color.slice(3, 5), 16);
      const b = parseInt(color.slice(5, 7), 16);

      image.imageData.data[pixelIndex] = r;
      image.imageData.data[pixelIndex + 1] = g;
      image.imageData.data[pixelIndex + 2] = b;
      image.imageData.data[pixelIndex + 3] = alpha;

      // Update canvas
      const ctx = image.canvas.getContext('2d');
      ctx.putImageData(image.imageData, 0, 0);
    }

    downloadImage(args) {
      if (this.currentImageIndex < 0 || this.currentImageIndex >= this.images.length) return;

      const name = Scratch.Cast.toString(args.NAME) || 'image';
      const format = Scratch.Cast.toString(args.FORMAT);
      const image = this.images[this.currentImageIndex];

      let mimeType, extension;
      switch (format) {
        case DownloadFormat.JPG:
          mimeType = 'image/jpeg';
          extension = 'jpg';
          break;
        case DownloadFormat.WEBP:
          mimeType = 'image/webp';
          extension = 'webp';
          break;
        case DownloadFormat.PNG:
        default:
          mimeType = 'image/png';
          extension = 'png';
          break;
      }

      const link = document.createElement('a');
      link.download = `${name}.${extension}`;
      link.href = image.canvas.toDataURL(mimeType);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }

    addToZip(args) {
      if (this.currentImageIndex < 0 || this.currentImageIndex >= this.images.length) return;

      const name = Scratch.Cast.toString(args.NAME) || 'image';
      const image = this.images[this.currentImageIndex];
      
      this.zipFiles.push({
        name: `${name}.png`,
        data: image.canvas.toDataURL('image/png')
      });
    }

    downloadZip() {
      if (this.zipFiles.length === 0) return;

      // In a real implementation, you would use a library like JSZip
      // This is a simplified version that just downloads the first file
      const file = this.zipFiles[0];
      const link = document.createElement('a');
      link.download = file.name;
      link.href = file.data;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }

    clearZip() {
      this.zipFiles = [];
    }

    rgbToHex(args) {
      const r = Math.max(0, Math.min(255, Math.round(Scratch.Cast.toNumber(args.R))));
      const g = Math.max(0, Math.min(255, Math.round(Scratch.Cast.toNumber(args.G))));
      const b = Math.max(0, Math.min(255, Math.round(Scratch.Cast.toNumber(args.B))));
      
      return `#${this._componentToHex(r)}${this._componentToHex(g)}${this._componentToHex(b)}`;
    }

    hslToHex(args) {
      const h = Math.max(0, Math.min(360, Math.round(Scratch.Cast.toNumber(args.H))));
      const s = Math.max(0, Math.min(100, Math.round(Scratch.Cast.toNumber(args.S))));
      const l = Math.max(0, Math.min(100, Math.round(Scratch.Cast.toNumber(args.L))));
      
      const rgb = this._hslToRgb(h / 360, s / 100, l / 100);
      return `#${this._componentToHex(rgb[0])}${this._componentToHex(rgb[1])}${this._componentToHex(rgb[2])}`;
    }

    showImageOnSprite(args, util) {
      const index = Math.max(1, Math.min(this.images.length, Math.round(Scratch.Cast.toNumber(args.INDEX)))) - 1;
      if (index < 0 || index >= this.images.length) return;

      const image = this.images[index];
      const skinId = this.renderer.createBitmapSkin(image.canvas, 1);
      
      const drawableId = util.target.drawableID;
      this.renderer._allDrawables[drawableId].skin = this.renderer._allSkins[skinId];
    }

    restoreOriginalCostume(args, util) {
      util.target.updateAllDrawableProperties();
    }

    // Helper methods
    async _loadImageElement(url) {
      return new Promise((resolve) => {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => resolve(img);
        img.onerror = () => resolve(null);
        img.src = url;
      });
    }

    _componentToHex(c) {
      const hex = c.toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    }

    _rgbToHsl(r, g, b) {
      r /= 255; g /= 255; b /= 255;
      const max = Math.max(r, g, b), min = Math.min(r, g, b);
      let h, s, l = (max + min) / 2;

      if (max === min) {
        h = s = 0; // achromatic
      } else {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
          case r: h = (g - b) / d + (g < b ? 6 : 0); break;
          case g: h = (b - r) / d + 2; break;
          case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
      }

      return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)];
    }

    _hslToRgb(h, s, l) {
      let r, g, b;

      if (s === 0) {
        r = g = b = l; // achromatic
      } else {
        const hue2rgb = (p, q, t) => {
          if (t < 0) t += 1;
          if (t > 1) t -= 1;
          if (t < 1/6) return p + (q - p) * 6 * t;
          if (t < 1/2) return q;
          if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
          return p;
        };

        const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        const p = 2 * l - q;
        r = hue2rgb(p, q, h + 1/3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1/3);
      }

      return [
        Math.round(r * 255),
        Math.round(g * 255),
        Math.round(b * 255)
      ];
    }
  }

  if (!Scratch.extensions.unsandboxed) {
    throw new Error('Image Processor extension must run unsandboxed');
  }
  Scratch.extensions.register(new ImageProcessor());
})(Scratch);
