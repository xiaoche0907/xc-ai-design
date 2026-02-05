'use client';

import { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { ImageUploader } from '@/components/features/ImageUploader';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Wand2,
  Download,
  Sun,
  Contrast,
  Palette,
  Type,
  Loader2,
  RotateCcw,
} from 'lucide-react';

export default function RefinementStudioPage() {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [saturation, setSaturation] = useState(100);

  const handleApplyFilter = async (filterName: string) => {
    setIsProcessing(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsProcessing(false);
  };

  const resetAdjustments = () => {
    setBrightness(100);
    setContrast(100);
    setSaturation(100);
  };

  const imageStyle = {
    filter: `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%)`,
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <Header />

      <main className="container mx-auto px-4 pt-24 pb-12">
        <div className="max-w-6xl mx-auto">
          {/* Page Title */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-sm font-medium mb-4">
              <Wand2 className="w-4 h-4" />
              智能精修
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-slate-900 dark:text-white">
              图片精修
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              调整、优化、导出，让您的产品图更加完美
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Panel - Image Preview */}
            <div className="lg:col-span-2">
              <Card className="p-6 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-base font-semibold text-slate-900 dark:text-white">图片预览</h2>
                  {uploadedImage && (
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={resetAdjustments}>
                        <RotateCcw className="w-4 h-4 mr-2" />
                        重置
                      </Button>
                      <Button size="sm" className="bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 dark:text-slate-900">
                        <Download className="w-4 h-4 mr-2" />
                        导出
                      </Button>
                    </div>
                  )}
                </div>

                {uploadedImage ? (
                  <div className="relative rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-800">
                    <img
                      src={uploadedImage}
                      alt="Editing"
                      className="w-full max-h-[500px] object-contain"
                      style={imageStyle}
                    />
                    {isProcessing && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <Loader2 className="w-10 h-10 text-white animate-spin" />
                      </div>
                    )}
                  </div>
                ) : (
                  <ImageUploader
                    onUpload={(_, preview) => setUploadedImage(preview)}
                    preview={null}
                  />
                )}
              </Card>
            </div>

            {/* Right Panel - Controls */}
            <div className="space-y-6">
              {uploadedImage ? (
                <>
                  <Card className="p-6 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm">
                    <Tabs defaultValue="adjust">
                      <TabsList className="grid w-full grid-cols-3 mb-4">
                        <TabsTrigger value="adjust">调整</TabsTrigger>
                        <TabsTrigger value="filter">滤镜</TabsTrigger>
                        <TabsTrigger value="export">导出</TabsTrigger>
                      </TabsList>

                      <TabsContent value="adjust" className="space-y-6">
                        {/* Brightness */}
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <label className="flex items-center gap-2 text-sm font-medium">
                              <Sun className="w-4 h-4" />
                              亮度
                            </label>
                            <span className="text-sm text-slate-500">
                              {brightness}%
                            </span>
                          </div>
                          <input
                            type="range"
                            min="50"
                            max="150"
                            value={brightness}
                            onChange={(e) => setBrightness(Number(e.target.value))}
                            className="w-full"
                          />
                        </div>

                        {/* Contrast */}
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <label className="flex items-center gap-2 text-sm font-medium">
                              <Contrast className="w-4 h-4" />
                              对比度
                            </label>
                            <span className="text-sm text-slate-500">
                              {contrast}%
                            </span>
                          </div>
                          <input
                            type="range"
                            min="50"
                            max="150"
                            value={contrast}
                            onChange={(e) => setContrast(Number(e.target.value))}
                            className="w-full"
                          />
                        </div>

                        {/* Saturation */}
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <label className="flex items-center gap-2 text-sm font-medium">
                              <Palette className="w-4 h-4" />
                              饱和度
                            </label>
                            <span className="text-sm text-slate-500">
                              {saturation}%
                            </span>
                          </div>
                          <input
                            type="range"
                            min="0"
                            max="200"
                            value={saturation}
                            onChange={(e) => setSaturation(Number(e.target.value))}
                            className="w-full"
                          />
                        </div>
                      </TabsContent>

                      <TabsContent value="filter" className="space-y-4">
                        <div className="grid grid-cols-2 gap-3">
                          {['原图', '明亮', '复古', '黑白', '暖色', '冷色'].map(
                            (filter) => (
                              <Button
                                key={filter}
                                variant="outline"
                                size="sm"
                                onClick={() => handleApplyFilter(filter)}
                                disabled={isProcessing}
                              >
                                {filter}
                              </Button>
                            )
                          )}
                        </div>
                      </TabsContent>

                      <TabsContent value="export" className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium mb-2">
                            导出尺寸
                          </label>
                          <div className="grid grid-cols-2 gap-2">
                            {[
                              { label: '1080p', size: '1920x1080' },
                              { label: '2K', size: '2560x1440' },
                              { label: '4K', size: '3840x2160' },
                              { label: '自定义', size: 'custom' },
                            ].map((option) => (
                              <Button
                                key={option.label}
                                variant="outline"
                                size="sm"
                              >
                                {option.label}
                              </Button>
                            ))}
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-2">
                            平台预设
                          </label>
                          <div className="grid grid-cols-2 gap-2">
                            {['淘宝', '京东', 'Shopify', '亚马逊'].map(
                              (platform) => (
                                <Button
                                  key={platform}
                                  variant="outline"
                                  size="sm"
                                >
                                  {platform}
                                </Button>
                              )
                            )}
                          </div>
                        </div>

                        <Button className="w-full bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 dark:text-slate-900 font-semibold">
                          <Download className="w-4 h-4 mr-2" />
                          导出图片 (消耗 5 积分)
                        </Button>
                      </TabsContent>
                    </Tabs>
                  </Card>
                </>
              ) : (
                <Card className="p-6 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm">
                  <div className="text-center text-slate-500 py-8">
                    <Wand2 className="w-12 h-12 mx-auto mb-4 text-slate-400" />
                    <p>上传图片后即可开始编辑</p>
                  </div>
                </Card>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
