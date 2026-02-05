'use client';

import { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
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
  Palette,
  Layers,
  Download,
  Loader2,
  Zap,
  CheckCircle,
  Eye,
  Shield,
  ArrowRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';

type TaskStatus = 'idle' | 'processing' | 'completed';
type TabMode = 'single' | 'batch';

export default function AestheticMirrorPage() {
  const [mode, setMode] = useState<TabMode>('single');
  const [styleImage, setStyleImage] = useState<string | null>(null);
  const [productImages, setProductImages] = useState<string[]>([]);
  const [additionalPrompt, setAdditionalPrompt] = useState('');
  const [model, setModel] = useState('nano-banana-pro');
  const [aspectRatio, setAspectRatio] = useState('1:1');
  const [resolution, setResolution] = useState('2k');
  const [generateCount, setGenerateCount] = useState('1');
  const [turboMode, setTurboMode] = useState(false);
  const [status, setStatus] = useState<TaskStatus>('idle');
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);

  const handleStyleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const preview = URL.createObjectURL(file);
    setStyleImage(preview);
  };

  const handleProductImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const maxImages = mode === 'single' ? 1 : 12;
    Array.from(files).forEach((file) => {
      if (productImages.length >= maxImages) return;
      const preview = URL.createObjectURL(file);
      setProductImages((prev) => [...prev, preview].slice(0, maxImages));
    });
  };

  const removeStyleImage = () => setStyleImage(null);
  const removeProductImage = (index: number) => {
    setProductImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleGenerate = async () => {
    if (!styleImage || productImages.length === 0) return;

    setStatus('processing');
    setGeneratedImages([]);

    // 模拟生成过程
    const count = parseInt(generateCount) * productImages.length;
    const mockImages: string[] = [];
    for (let i = 0; i < count; i++) {
      await new Promise((resolve) => setTimeout(resolve, 800));
      mockImages.push(`https://picsum.photos/seed/${Date.now() + i}/400/400`);
      setGeneratedImages([...mockImages]);
    }

    setStatus('completed');
  };

  const credits = parseInt(generateCount) * productImages.length * 5;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <Header />

      <main className="container mx-auto px-4 pt-24 pb-12">
        <div className="max-w-6xl mx-auto">
          {/* Page Title */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-sm font-medium mb-4">
              <Sparkles className="w-4 h-4" />
              AI 驱动
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-slate-900 dark:text-white">
              一键复刻爆款详情页风格
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              上传您喜欢的设计参考图和产品素材，AI 将智能融合风格与产品特性，生成专属于您的高转化详情图
            </p>
          </div>

          {/* Mode Tabs */}
          <div className="flex justify-center mb-10">
            <div className="inline-flex bg-slate-100 dark:bg-slate-900 rounded-xl p-1 border border-slate-200 dark:border-slate-800">
              <button
                onClick={() => {
                  setMode('single');
                  setProductImages([]);
                }}
                className={cn(
                  'flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all',
                  mode === 'single'
                    ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                )}
              >
                <Sparkles className="w-4 h-4" />
                单图复刻
              </button>
              <button
                onClick={() => {
                  setMode('batch');
                  setProductImages([]);
                }}
                className={cn(
                  'flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all',
                  mode === 'batch'
                    ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                )}
              >
                <Layers className="w-4 h-4" />
                批量复刻
              </button>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Left Panel - Input */}
            <div className="space-y-6">
              {/* Style Reference Upload */}
              <Card className="p-6 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="flex items-center gap-2.5 mb-1">
                  <div className="w-9 h-9 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                    <Palette className="w-5 h-5 text-slate-700 dark:text-slate-300" />
                  </div>
                  <h2 className="text-base font-semibold text-slate-900 dark:text-white">参考设计图</h2>
                </div>
                <p className="text-sm text-slate-500 mb-4 ml-11">上传具有明确风格的参考图</p>

                {styleImage ? (
                  <div className="relative aspect-video rounded-lg overflow-hidden bg-slate-100">
                    <img src={styleImage} alt="Style reference" className="w-full h-full object-cover" />
                    <button
                      onClick={removeStyleImage}
                      className="absolute top-2 right-2 p-1.5 bg-black/60 hover:bg-black/80 rounded-lg text-white transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <label className="block aspect-video border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-lg cursor-pointer hover:border-slate-400 dark:hover:border-slate-600 transition-colors bg-slate-50 dark:bg-slate-900/50">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleStyleImageUpload}
                      className="hidden"
                    />
                    <div className="h-full flex flex-col items-center justify-center">
                      <Upload className="w-8 h-8 text-slate-400 mb-2" />
                      <span className="text-slate-700 dark:text-slate-300 font-medium">拖拽图片到这里</span>
                      <span className="text-sm text-slate-500">或点击选择文件 (PNG, JPG)</span>
                    </div>
                  </label>
                )}
              </Card>

              {/* Product Image Upload */}
              <Card className="p-6 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                      <Layers className="w-5 h-5 text-slate-700 dark:text-slate-300" />
                    </div>
                    <h2 className="text-base font-semibold text-slate-900 dark:text-white">产品素材图</h2>
                  </div>
                  {mode === 'batch' && (
                    <span className="text-sm font-medium text-slate-500">{productImages.length}/12 张</span>
                  )}
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 ml-11">
                  {mode === 'single'
                    ? '上传产品图片，支持多张拼接'
                    : '上传需要复刻风格的产品素材图'}
                </p>

                <div className={cn(
                  'grid gap-3',
                  mode === 'single' ? 'grid-cols-1' : 'grid-cols-3'
                )}>
                  {productImages.map((img, index) => (
                    <div key={index} className="relative aspect-square rounded-lg overflow-hidden bg-slate-100">
                      <img src={img} alt={`Product ${index + 1}`} className="w-full h-full object-cover" />
                      <button
                        onClick={() => removeProductImage(index)}
                        className="absolute top-2 right-2 p-1 bg-black/50 rounded-full text-white hover:bg-black/70"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                  {(mode === 'single' ? productImages.length < 1 : productImages.length < 12) && (
                    <label className={cn(
                      'border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-lg cursor-pointer hover:border-slate-400 dark:hover:border-slate-600 transition-colors bg-slate-50 dark:bg-slate-900/50 flex flex-col items-center justify-center',
                      mode === 'single' ? 'aspect-video' : 'aspect-square'
                    )}>
                      <input
                        type="file"
                        accept="image/*"
                        multiple={mode === 'batch'}
                        onChange={handleProductImageUpload}
                        className="hidden"
                      />
                      <Upload className="w-6 h-6 text-slate-400 mb-2" />
                      <span className="text-xs text-slate-600 dark:text-slate-400 text-center px-2">
                        {mode === 'single'
                          ? '上传你希望出现在图片中的元素素材'
                          : '点击或拖拽上传多张图片'}
                      </span>
                    </label>
                  )}
                </div>
              </Card>

              {/* Additional Prompt */}
              <Card className="p-6 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm">
                <h2 className="text-base font-semibold text-slate-900 dark:text-white mb-2">补充提示词（可选）</h2>
                <Textarea
                  value={additionalPrompt}
                  onChange={(e) => setAdditionalPrompt(e.target.value)}
                  placeholder="例如：添加「限时特惠」文字，使用红色主题..."
                  className="min-h-[80px] resize-none"
                />
              </Card>

              {/* Settings */}
              <Card className="p-6 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="grid grid-cols-2 gap-4">
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
                        <SelectItem value="1">{mode === 'single' ? '1 张' : '1 组'}</SelectItem>
                        <SelectItem value="2">{mode === 'single' ? '2 张' : '2 组'}</SelectItem>
                        <SelectItem value="4">{mode === 'single' ? '4 张' : '4 组'}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-200 dark:border-slate-700">
                  <div className="flex items-center gap-3">
                    <Zap className="w-5 h-5 text-yellow-500" />
                    <div>
                      <span className="font-medium">Turbo 加速模式</span>
                      <p className="text-xs text-slate-500">更快、更稳定</p>
                    </div>
                  </div>
                  <Switch checked={turboMode} onCheckedChange={setTurboMode} />
                </div>
              </Card>

              {/* Generate Button */}
              <Button
                size="lg"
                className="w-full bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 dark:text-slate-900 h-12 font-semibold shadow-sm"
                onClick={handleGenerate}
                disabled={!styleImage || productImages.length === 0 || status === 'processing'}
              >
                {status === 'processing' ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    生成中...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    生成 {parseInt(generateCount) * Math.max(productImages.length, 1)} 张详情图
                  </>
                )}
              </Button>
              <p className="text-center text-sm text-slate-500">
                消耗 {credits || '--'} 积分
              </p>
            </div>

            {/* Right Panel - Results */}
            <div>
              <Card className="p-6 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm sticky top-24">
                <div className="flex items-center gap-2.5 mb-4">
                  <div className="w-9 h-9 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-slate-700 dark:text-slate-300" />
                  </div>
                  <h2 className="text-base font-semibold text-slate-900 dark:text-white">
                    {mode === 'single' ? '生成结果' : '批量生成结果'}
                  </h2>
                </div>

                {status === 'idle' && generatedImages.length === 0 && (
                  <div className="flex flex-col items-center justify-center h-64 text-slate-400">
                    <Sparkles className="w-12 h-12 mb-4" />
                    <p>等待生成</p>
                  </div>
                )}

                {status === 'processing' && (
                  <div className="flex flex-col items-center justify-center h-64">
                    <Loader2 className="w-12 h-12 animate-spin text-slate-400 mb-4" />
                    <p className="text-slate-500">正在生成图片...</p>
                  </div>
                )}

                {generatedImages.length > 0 && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      {generatedImages.map((img, index) => (
                        <div
                          key={index}
                          className="relative group rounded-lg overflow-hidden aspect-square bg-slate-100"
                        >
                          <img
                            src={img}
                            alt={`Generated ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <Button size="sm" variant="secondary">
                              <Download className="w-4 h-4" />
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

          {/* Feature Cards */}
          <div className="grid md:grid-cols-3 gap-6 mt-16">
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto mb-3">
                <Eye className="w-6 h-6 text-slate-600" />
              </div>
              <h3 className="font-semibold mb-1">智能风格融合</h3>
              <p className="text-sm text-slate-500">AI 精准提取参考图的设计语言和视觉风格</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto mb-3">
                <Shield className="w-6 h-6 text-slate-600" />
              </div>
              <h3 className="font-semibold mb-1">产品特性保留</h3>
              <p className="text-sm text-slate-500">完整保留产品细节和卖点，突出商品优势</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto mb-3">
                <ArrowRight className="w-6 h-6 text-slate-600" />
              </div>
              <h3 className="font-semibold mb-1">一键生成导出</h3>
              <p className="text-sm text-slate-500">快速生成高清大图，支持多种尺寸导出</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
