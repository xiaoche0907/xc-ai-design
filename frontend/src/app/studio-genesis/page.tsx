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
  Check,
} from 'lucide-react';
import { cn } from '@/lib/utils';

type TaskStatus = 'idle' | 'analyzing' | 'planning' | 'generating' | 'completed';

const LANGUAGES = [
  { value: 'no-text', label: '无文字(纯视觉)' },
  { value: 'zh-CN', label: '中文(简体)' },
  { value: 'zh-TW', label: '中文(繁体)' },
  { value: 'en', label: '英语' },
  { value: 'ja', label: '日本語' },
  { value: 'ko', label: '韩语' },
  { value: 'de', label: '德语' },
  { value: 'fr', label: '法语' },
  { value: 'ar', label: '阿拉伯语' },
  { value: 'ru', label: '俄语' },
  { value: 'th', label: '泰语' },
  { value: 'id', label: '印尼语' },
  { value: 'pt', label: '葡萄牙语' },
];

const ASPECT_RATIOS = [
  { value: '1:1', label: '1:1 正方形' },
  { value: '2:3', label: '2:3 竖版' },
  { value: '3:2', label: '3:2 横版' },
  { value: '3:4', label: '3:4 竖版' },
  { value: '4:3', label: '4:3 横版' },
  { value: '4:5', label: '4:5 竖版' },
  { value: '5:4', label: '5:4 横版' },
  { value: '9:16', label: '9:16 手机竖版' },
  { value: '16:9', label: '16:9 宽屏' },
  { value: '21:9', label: '21:9 超宽屏' },
];

const RESOLUTIONS = [
  { value: '1k', label: '1K 标准' },
  { value: '2k', label: '2K 高清 (仅Pro)' },
  { value: '4k', label: '4K 超清 (仅Pro)' },
];

const STEPS = [
  { id: 1, label: '输入' },
  { id: 2, label: '分析中' },
  { id: 3, label: '确认规划' },
  { id: 4, label: '生成中' },
  { id: 5, label: '完成' },
];

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

    // Step 2: 分析中
    setStatus('analyzing');
    setCurrentStep(2);
    setProgress(0);

    for (let i = 0; i <= 100; i += 10) {
      await new Promise((resolve) => setTimeout(resolve, 150));
      setProgress(i);
    }

    // Step 3: 确认规划
    setStatus('planning');
    setCurrentStep(3);
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Step 4: 生成中
    setStatus('generating');
    setCurrentStep(4);

    const count = parseInt(generateCount);
    const mockImages: string[] = [];
    for (let i = 0; i < count; i++) {
      await new Promise((resolve) => setTimeout(resolve, 800));
      mockImages.push(`https://picsum.photos/seed/${Date.now() + i}/400/533`);
      setGeneratedImages([...mockImages]);
    }

    // Step 5: 完成
    setStatus('completed');
    setCurrentStep(5);
  };

  const getStepStatus = (stepId: number) => {
    if (stepId < currentStep) return 'completed';
    if (stepId === currentStep) return 'active';
    return 'pending';
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <Header />

      <main className="container mx-auto px-4 pt-24 pb-12">
        <div className="max-w-6xl mx-auto">
          {/* Progress Steps - 5 Steps */}
          <div className="flex items-center justify-center mb-10">
            {STEPS.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className="flex items-center gap-2">
                  <div
                    className={cn(
                      'w-7 h-7 rounded-full flex items-center justify-center text-sm font-medium transition-all',
                      getStepStatus(step.id) === 'completed'
                        ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                        : getStepStatus(step.id) === 'active'
                        ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                        : 'bg-slate-200 text-slate-500 dark:bg-slate-800 dark:text-slate-400'
                    )}
                  >
                    {getStepStatus(step.id) === 'completed' ? (
                      <Check className="w-4 h-4" />
                    ) : (
                      step.id
                    )}
                  </div>
                  <span
                    className={cn(
                      'text-sm font-medium transition-colors',
                      getStepStatus(step.id) !== 'pending'
                        ? 'text-slate-900 dark:text-white'
                        : 'text-slate-400 dark:text-slate-500'
                    )}
                  >
                    {step.label}
                  </span>
                </div>
                {index < STEPS.length - 1 && (
                  <div
                    className={cn(
                      'w-16 h-px mx-3 transition-colors',
                      currentStep > step.id
                        ? 'bg-slate-900 dark:bg-white'
                        : 'bg-slate-300 dark:bg-slate-700'
                    )}
                  />
                )}
              </div>
            ))}
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Left Panel - Input */}
            <div className="space-y-6">
              {/* Product Images Upload */}
              <Card className="p-6 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                      <ImageIcon className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                    </div>
                    <div>
                      <h2 className="text-base font-semibold text-slate-900 dark:text-white">产品图</h2>
                      <p className="text-xs text-slate-500">上传清晰的产品图片</p>
                    </div>
                  </div>
                  <span className="text-sm font-medium text-slate-500">
                    {productImages.length}/6
                  </span>
                </div>

                {productImages.length > 0 ? (
                  <div className="grid grid-cols-3 gap-3 mb-3">
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
                      <label className="aspect-square border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-slate-400 transition-colors bg-slate-50 dark:bg-slate-900/50">
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          onChange={handleImageUpload}
                          className="hidden"
                        />
                        <Upload className="w-5 h-5 text-slate-400 mb-1" />
                        <span className="text-xs text-slate-400">添加图片</span>
                      </label>
                    )}
                  </div>
                ) : (
                  <label className="block border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-lg p-8 cursor-pointer hover:border-slate-400 transition-colors bg-slate-50 dark:bg-slate-900/50">
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                    <div className="flex flex-col items-center text-center">
                      <Upload className="w-8 h-8 text-slate-400 mb-3" />
                      <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                        多图上传时建议仅上传必要的视角或sku图，图片不是越多越好
                      </p>
                    </div>
                  </label>
                )}
              </Card>

              {/* Requirements */}
              <Card className="p-6 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="mb-4">
                  <h2 className="text-base font-semibold text-slate-900 dark:text-white mb-1">组图要求</h2>
                  <p className="text-xs text-slate-500">
                    描述您的产品信息和期望的图片风格
                  </p>
                </div>

                <Textarea
                  value={requirements}
                  onChange={(e) => setRequirements(e.target.value)}
                  placeholder={`建议输入：产品名称、卖点、目标人群、详情图风格等

例如：这是一款日式抹茶沐浴露，主打天然成分和舒缓放松功效，目标人群为25-40岁女性白领，希望详情图风格简约自然、清新淡雅的莫兰迪色系...`}
                  className="min-h-[140px] resize-none text-sm"
                />

                {/* Settings Grid */}
                <div className="grid grid-cols-2 gap-4 mt-6">
                  <div>
                    <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5">目标语言</label>
                    <Select value={targetLanguage} onValueChange={setTargetLanguage}>
                      <SelectTrigger className="h-9 text-sm">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {LANGUAGES.map((lang) => (
                          <SelectItem key={lang.value} value={lang.value}>
                            {lang.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5">模型</label>
                    <Select value={model} onValueChange={setModel}>
                      <SelectTrigger className="h-9 text-sm">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="nano-banana-pro">Nano Banana Pro</SelectItem>
                        <SelectItem value="nano-banana">Nano Banana</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5">尺寸比例</label>
                    <Select value={aspectRatio} onValueChange={setAspectRatio}>
                      <SelectTrigger className="h-9 text-sm">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {ASPECT_RATIOS.map((ratio) => (
                          <SelectItem key={ratio.value} value={ratio.value}>
                            {ratio.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5">清晰度</label>
                    <Select value={resolution} onValueChange={setResolution}>
                      <SelectTrigger className="h-9 text-sm">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {RESOLUTIONS.map((res) => (
                          <SelectItem key={res.value} value={res.value}>
                            {res.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="col-span-2">
                    <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5">生成数量</label>
                    <Select value={generateCount} onValueChange={setGenerateCount}>
                      <SelectTrigger className="h-9 text-sm">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({ length: 13 }, (_, i) => i + 1).map((num) => (
                          <SelectItem key={num} value={String(num)}>
                            {num} 张
                          </SelectItem>
                        ))}
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
                disabled={productImages.length === 0 || status === 'analyzing' || status === 'generating' || status === 'planning'}
              >
                {status === 'analyzing' ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    分析产品中...
                  </>
                ) : status === 'planning' ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    确认规划中...
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
                  <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                  </div>
                  <div>
                    <h2 className="text-base font-semibold text-slate-900 dark:text-white">生成结果</h2>
                    <p className="text-xs text-slate-500">上传产品图并点击分析开始</p>
                  </div>
                </div>

                {status === 'idle' && generatedImages.length === 0 && (
                  <div className="flex flex-col items-center justify-center py-20 text-slate-400">
                    <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-4">
                      <Sparkles className="w-8 h-8 text-slate-300 dark:text-slate-600" />
                    </div>
                    <p className="text-sm text-slate-500 text-center">
                      上传产品图并填写要求后
                    </p>
                    <p className="text-sm text-slate-500 text-center">
                      点击"分析产品"开始
                    </p>
                  </div>
                )}

                {(status === 'analyzing' || status === 'planning' || status === 'generating') && generatedImages.length === 0 && (
                  <div className="flex flex-col items-center justify-center py-20">
                    <Loader2 className="w-12 h-12 animate-spin text-slate-400 mb-4" />
                    <p className="text-sm text-slate-500">
                      {status === 'analyzing' && '正在分析产品特征...'}
                      {status === 'planning' && '正在生成创作规划...'}
                      {status === 'generating' && '正在生成图片...'}
                    </p>
                    {status === 'analyzing' && (
                      <p className="text-xs text-slate-400 mt-1">{progress}%</p>
                    )}
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
                            <Button size="sm" variant="secondary" className="h-8 w-8 p-0">
                              <Download className="w-4 h-4" />
                            </Button>
                            <Button size="sm" variant="secondary" className="h-8 w-8 p-0">
                              <RefreshCw className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>

                    {status === 'completed' && (
                      <Button variant="outline" className="w-full h-10">
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
