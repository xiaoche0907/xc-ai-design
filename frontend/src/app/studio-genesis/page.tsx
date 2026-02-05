'use client';

import { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Sparkles,
  Upload,
  X,
  Image as ImageIcon,
  Loader2,
  Download,
  RefreshCw,
} from 'lucide-react';
import { cn } from '@/lib/utils';

type TaskStatus = 'idle' | 'analyzing' | 'generating' | 'completed';

export default function StudioGenesisPage() {
  const [productImages, setProductImages] = useState<string[]>([]);
  const [requirements, setRequirements] = useState('');
  const [targetLanguage, setTargetLanguage] = useState('no-text');
  const [model, setModel] = useState('nano-banana-pro');
  const [aspectRatio, setAspectRatio] = useState('3:4');
  const [resolution, setResolution] = useState('2k');
  const [generateCount, setGenerateCount] = useState('1');
  const [status, setStatus] = useState<TaskStatus>('idle');
  const [progress, setProgress] = useState(0);
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);
  const [currentStep, setCurrentStep] = useState(1);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach((file) => {
      if (productImages.length >= 6) return;
      const preview = URL.createObjectURL(file);
      setProductImages((prev) => [...prev, preview].slice(0, 6));
    });
  };

  const removeImage = (index: number) => {
    setProductImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleAnalyze = async () => {
    if (productImages.length === 0) return;

    setStatus('analyzing');
    setCurrentStep(2);
    setProgress(0);

    // 模拟分析过程
    for (let i = 0; i <= 100; i += 10) {
      await new Promise((resolve) => setTimeout(resolve, 200));
      setProgress(i);
    }

    setStatus('generating');

    // 模拟生成过程
    const count = parseInt(generateCount);
    const mockImages: string[] = [];
    for (let i = 0; i < count; i++) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      mockImages.push(`https://picsum.photos/seed/${Date.now() + i}/400/533`);
      setGeneratedImages([...mockImages]);
    }

    setStatus('completed');
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <Header />

      <main className="container mx-auto px-4 pt-24 pb-12">
        <div className="max-w-6xl mx-auto">
          {/* Progress Steps */}
          <div className="flex items-center justify-center gap-6 mb-10">
            <div className="flex items-center gap-2.5">
              <div
                className={cn(
                  'w-8 h-8 rounded-lg flex items-center justify-center text-sm font-semibold transition-all',
                  currentStep >= 1
                    ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-sm'
                    : 'bg-slate-200 text-slate-500 dark:bg-slate-800 dark:text-slate-400'
                )}
              >
                1
              </div>
              <span className="text-sm font-medium text-slate-900 dark:text-white">输入</span>
            </div>
            <div className="w-12 h-px bg-slate-300 dark:bg-slate-700" />
            <div className="flex items-center gap-2.5">
              <div
                className={cn(
                  'w-8 h-8 rounded-lg flex items-center justify-center text-sm font-semibold transition-all',
                  currentStep >= 2
                    ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-sm'
                    : 'bg-slate-200 text-slate-500 dark:bg-slate-800 dark:text-slate-400'
                )}
              >
                2
              </div>
              <span className={cn(
                'text-sm font-medium transition-colors',
                currentStep >= 2 ? 'text-slate-900 dark:text-white' : 'text-slate-500 dark:text-slate-400'
              )}>
                分析中
              </span>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Panel - Input */}
            <div className="lg:col-span-2 space-y-6">
              {/* Product Images Upload */}
              <Card className="p-6 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                      <ImageIcon className="w-5 h-5 text-slate-700 dark:text-slate-300" />
                    </div>
                    <div>
                      <h2 className="text-base font-semibold text-slate-900 dark:text-white">产品图</h2>
                      <p className="text-sm text-slate-500">上传清晰的产品图片</p>
                    </div>
                  </div>
                  <span className="text-sm font-medium text-slate-500">
                    {productImages.length}/6
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  {productImages.map((img, index) => (
                    <div key={index} className="relative aspect-square rounded-lg overflow-hidden bg-slate-100">
                      <img src={img} alt={`Product ${index + 1}`} className="w-full h-full object-cover" />
                      <button
                        onClick={() => removeImage(index)}
                        className="absolute top-2 right-2 p-1 bg-black/50 rounded-full text-white hover:bg-black/70"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                  {productImages.length < 6 && (
                    <label className="aspect-square border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-slate-400 transition-colors">
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                      <Upload className="w-6 h-6 text-slate-400 mb-2" />
                      <span className="text-xs text-slate-500 text-center px-2">
                        多图上传时建议仅上传必要的视角或sku图，图片不是越多越好
                      </span>
                    </label>
                  )}
                </div>
              </Card>

              {/* Requirements */}
              <Card className="p-6 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="mb-4">
                  <h2 className="text-base font-semibold text-slate-900 dark:text-white mb-1.5">组图要求</h2>
                  <p className="text-sm text-slate-500">
                    描述您的产品信息和期望的图片风格
                  </p>
                </div>

                <Textarea
                  value={requirements}
                  onChange={(e) => setRequirements(e.target.value)}
                  placeholder={`建议输入：产品名称、卖点、目标人群、详情图风格等

例如：这是一款日式抹茶沐浴露，主打天然成分和舒缓放松功效，目标人群为25-40岁女性白领，希望详情图风格简约自然...`}
                  className="min-h-[120px] resize-none"
                />
              </Card>

              {/* Settings */}
              <Card className="p-6 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">目标语言</label>
                    <Select value={targetLanguage} onValueChange={setTargetLanguage}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="no-text">无文字(纯视觉)</SelectItem>
                        <SelectItem value="chinese">中文</SelectItem>
                        <SelectItem value="english">英文</SelectItem>
                        <SelectItem value="japanese">日文</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">模型</label>
                    <Select value={model} onValueChange={setModel}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="nano-banana-pro">Nano Banana Pro</SelectItem>
                        <SelectItem value="nano-banana">Nano Banana</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">尺寸比例</label>
                    <Select value={aspectRatio} onValueChange={setAspectRatio}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1:1">1:1 正方形</SelectItem>
                        <SelectItem value="3:4">3:4 竖版</SelectItem>
                        <SelectItem value="4:3">4:3 横版</SelectItem>
                        <SelectItem value="9:16">9:16 长图</SelectItem>
                        <SelectItem value="16:9">16:9 宽屏</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">清晰度</label>
                    <Select value={resolution} onValueChange={setResolution}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1k">1K 标准</SelectItem>
                        <SelectItem value="2k">2K 高清 (仅Pro)</SelectItem>
                        <SelectItem value="4k">4K 超清 (仅Pro)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">生成数量</label>
                    <Select value={generateCount} onValueChange={setGenerateCount}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1 张</SelectItem>
                        <SelectItem value="3">3 张</SelectItem>
                        <SelectItem value="5">5 张</SelectItem>
                        <SelectItem value="8">8 张</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </Card>

              {/* Generate Button */}
              <Button
                size="lg"
                className="w-full bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 dark:text-slate-900 h-12 font-semibold shadow-sm"
                onClick={handleAnalyze}
                disabled={productImages.length === 0 || status === 'analyzing' || status === 'generating'}
              >
                {status === 'analyzing' ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    分析产品中...
                  </>
                ) : status === 'generating' ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    生成图片中...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    分析产品
                  </>
                )}
              </Button>
            </div>

            {/* Right Panel - Results */}
            <div>
              <Card className="p-6 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm sticky top-24">
                <div className="flex items-center gap-2.5 mb-4">
                  <div className="w-9 h-9 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-slate-700 dark:text-slate-300" />
                  </div>
                  <div>
                    <h2 className="text-base font-semibold text-slate-900 dark:text-white">生成结果</h2>
                    <p className="text-xs text-slate-500">上传产品图后开始</p>
                  </div>
                </div>

                {status === 'idle' && generatedImages.length === 0 && (
                  <div className="flex flex-col items-center justify-center h-64 text-slate-400">
                    <Sparkles className="w-12 h-12 mb-4" />
                    <p>等待生成</p>
                  </div>
                )}

                {(status === 'analyzing' || status === 'generating') && (
                  <div className="flex flex-col items-center justify-center h-64">
                    <Loader2 className="w-12 h-12 animate-spin text-slate-400 mb-4" />
                    <p className="text-slate-500">
                      {status === 'analyzing' ? '正在分析产品...' : '正在生成图片...'}
                    </p>
                    <p className="text-sm text-slate-400">{progress}%</p>
                  </div>
                )}

                {generatedImages.length > 0 && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      {generatedImages.map((img, index) => (
                        <div
                          key={index}
                          className="relative group rounded-lg overflow-hidden aspect-[3/4] bg-slate-100"
                        >
                          <img
                            src={img}
                            alt={`Generated ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                            <Button size="sm" variant="secondary">
                              <Download className="w-4 h-4" />
                            </Button>
                            <Button size="sm" variant="secondary">
                              <RefreshCw className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>

                    {status === 'completed' && (
                      <Button variant="outline" className="w-full">
                        <Download className="w-4 h-4 mr-2" />
                        下载全部
                      </Button>
                    )}
                  </div>
                )}
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
