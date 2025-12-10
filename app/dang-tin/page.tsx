"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  RadioGroup,
  RadioGroupItem,
} from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Upload, X, Phone, Loader2 } from "lucide-react";

const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

type VipType = "none" | "KIMCUONG" | "VANG" | "BAC";

interface FormData {
  title: string;
  description: string;
  price: string;
  area: string;
  floors: string;
  bedrooms: string;
  bathrooms: string;
  city: string;
  district: string;
  ward: string;
  street: string;
  alley: string;
  vipType: VipType;
}

export default function PostPropertyPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { user } = useAuth();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>([]);

  const [formData, setFormData] = useState<FormData>({
    title: "",
    description: "",
    price: "",
    area: "",
    floors: "",
    bedrooms: "",
    bathrooms: "",
    city: "Hà Nội",
    district: "",
    ward: "",
    street: "",
    alley: "",
    vipType: "none",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleVipChange = (value: VipType) => {
    setFormData((prev) => ({ ...prev, vipType: value }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newFiles = Array.from(files).slice(0, 20 - selectedImages.length);
    const validFiles: File[] = [];

    newFiles.forEach((file) => {
      if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
        toast({
          title: "Lỗi",
          description: `File "${file.name}" không phải định dạng ảnh hợp lệ`,
          variant: "destructive",
        });
        return;
      }

      if (file.size > MAX_FILE_SIZE) {
        toast({
          title: "Lỗi",
          description: `File "${file.name}" vượt quá 5MB`,
          variant: "destructive",
        });
        return;
      }

      validFiles.push(file);

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviewUrls((prev) => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });

    setSelectedImages((prev) => [...prev, ...validFiles]);
  };

  const removeImage = (index: number) => {
    setSelectedImages((prev) => prev.filter((_, i) => i !== index));
    setImagePreviewUrls((prev) => prev.filter((_, i) => i !== index));
  };

  const validateForm = (): boolean => {
    if (!formData.title.trim()) {
      toast({
        title: "Lỗi",
        description: "Vui lòng nhập tiêu đề",
        variant: "destructive",
      });
      return false;
    }
    if (!formData.price || parseFloat(formData.price) <= 0) {
      toast({
        title: "Lỗi",
        description: "Vui lòng nhập giá hợp lệ",
        variant: "destructive",
      });
      return false;
    }
    if (!formData.area || parseFloat(formData.area) <= 0) {
      toast({
        title: "Lỗi",
        description: "Vui lòng nhập diện tích hợp lệ",
        variant: "destructive",
      });
      return false;
    }
    if (!formData.district.trim()) {
      toast({
        title: "Lỗi",
        description: "Vui lòng nhập quận/huyện",
        variant: "destructive",
      });
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const { data: propertyData, error: insertError } = await supabase
        .from("properties")
        .insert({
          title: formData.title.trim(),
          description: formData.description.trim() || null,
          price: parseFloat(formData.price),
          area: parseFloat(formData.area),
          floors: formData.floors ? parseInt(formData.floors) : null,
          bedrooms: formData.bedrooms ? parseInt(formData.bedrooms) : null,
          bathrooms: formData.bathrooms ? parseInt(formData.bathrooms) : null,
          city: formData.city,
          district: formData.district.trim(),
          ward: formData.ward.trim() || null,
          street: formData.street.trim() || null,
          alley: formData.alley.trim() || null,
          vip_type: formData.vipType,
          images: [],
          user_id: user?.id,
        })
        .select()
        .single();

      if (insertError) throw insertError;

      const propertyId = propertyData.id;
      const uploadedUrls: string[] = [];

      for (const file of selectedImages) {
        const fileExt = file.name.split(".").pop();
        const fileName = `${Date.now()}-${Math.random()
          .toString(36)
          .substring(7)}.${fileExt}`;
        const filePath = `properties/${propertyId}/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from("property-images")
          .upload(filePath, file);

        if (uploadError) continue;

        const { data: urlData } = supabase.storage
          .from("property-images")
          .getPublicUrl(filePath);

        uploadedUrls.push(urlData.publicUrl);
      }

      if (uploadedUrls.length > 0) {
        await supabase
          .from("properties")
          .update({ images: uploadedUrls })
          .eq("id", propertyId);
      }

      toast({
        title: "Đăng tin thành công",
        description: "Tin của bạn đã được tạo.",
      });

      router.push(`/nha-dat-ban/${propertyId}`);
    } catch (error) {
      console.error(error);
      toast({
        title: "Lỗi",
        description: "Có lỗi xảy ra khi đăng tin, vui lòng thử lại.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      <div className="container-custom py-8 lg:py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl lg:text-3xl font-bold mb-6">
            Đăng tin bất động sản
          </h1>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Thông tin cơ bản */}
            <section className="bg-card rounded-lg p-4 md:p-6 space-y-4">
              <h2 className="text-lg font-semibold">Thông tin cơ bản</h2>

              <div className="space-y-2">
                <Label htmlFor="title">
                  Tiêu đề tin đăng <span className="text-primary">*</span>
                </Label>
                <Input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Ví dụ: Bán nhà riêng 40m2, 4 tầng, ngõ rộng, Thanh Xuân"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">
                    Giá bán (tỷ) <span className="text-primary">*</span>
                  </Label>
                  <Input
                    id="price"
                    name="price"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.price}
                    onChange={handleInputChange}
                    placeholder="Ví dụ: 7.5"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="area">
                    Diện tích (m²) <span className="text-primary">*</span>
                  </Label>
                  <Input
                    id="area"
                    name="area"
                    type="number"
                    min="0"
                    step="0.1"
                    value={formData.area}
                    onChange={handleInputChange}
                    placeholder="Ví dụ: 40"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="floors">Số tầng</Label>
                  <Input
                    id="floors"
                    name="floors"
                    type="number"
                    min="1"
                    value={formData.floors}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bedrooms">Phòng ngủ</Label>
                  <Input
                    id="bedrooms"
                    name="bedrooms"
                    type="number"
                    min="0"
                    value={formData.bedrooms}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bathrooms">Phòng tắm</Label>
                  <Input
                    id="bathrooms"
                    name="bathrooms"
                    type="number"
                    min="0"
                    value={formData.bathrooms}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Mô tả chi tiết</Label>
                <Textarea
                  id="description"
                  name="description"
                  rows={6}
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Mô tả chi tiết về căn nhà, vị trí, nội thất, pháp lý..."
                />
              </div>
            </section>

            {/* Địa chỉ */}
            <section className="bg-card rounded-lg p-4 md:p-6 space-y-4">
              <h2 className="text-lg font-semibold">Địa chỉ bất động sản</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Thành phố</Label>
                  <Input value={formData.city} disabled />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="district">
                    Quận / Huyện <span className="text-primary">*</span>
                  </Label>
                  <Input
                    id="district"
                    name="district"
                    value={formData.district}
                    onChange={handleInputChange}
                    placeholder="Ví dụ: Thanh Xuân"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="ward">Phường / Xã</Label>
                  <Input
                    id="ward"
                    name="ward"
                    value={formData.ward}
                    onChange={handleInputChange}
                    placeholder="Ví dụ: Nhân Chính"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="street">Đường / Phố</Label>
                  <Input
                    id="street"
                    name="street"
                    value={formData.street}
                    onChange={handleInputChange}
                    placeholder="Ví dụ: Chính Kinh"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="alley">Ngõ / Ngách</Label>
                  <Input
                    id="alley"
                    name="alley"
                    value={formData.alley}
                    onChange={handleInputChange}
                    placeholder="Ví dụ: Ngõ 109"
                  />
                </div>
              </div>
            </section>

            {/* Gói VIP */}
            <section className="bg-card rounded-lg p-4 md:p-6 space-y-4">
              <h2 className="text-lg font-semibold">Gói hiển thị tin</h2>
              <p className="text-sm text-muted-foreground">
                Lựa chọn gói VIP giúp tin đăng nổi bật hơn trong danh sách.
              </p>

              <RadioGroup
                value={formData.vipType}
                onValueChange={(value) => handleVipChange(value as VipType)}
                className="grid grid-cols-1 md:grid-cols-4 gap-3"
              >
                <label className="vip-option">
                  <RadioGroupItem value="none" />
                  <div>
                    <div className="font-semibold">Tin thường</div>
                    <div className="text-xs text-muted-foreground">
                      Hiển thị theo thứ tự thời gian
                    </div>
                  </div>
                </label>

                <label className="vip-option">
                  <RadioGroupItem value="BAC" />
                  <div>
                    <div className="font-semibold text-slate-700">
                      VIP Bạc
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Vị trí nổi bật hơn tin thường
                    </div>
                  </div>
                </label>

                <label className="vip-option">
                  <RadioGroupItem value="VANG" />
                  <div>
                    <div className="font-semibold text-amber-600">
                      VIP Vàng
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Ưu tiên hiển thị trên cùng
                    </div>
                  </div>
                </label>

                <label className="vip-option">
                  <RadioGroupItem value="KIMCUONG" />
                  <div>
                    <div className="font-semibold text-violet-600">
                      VIP Kim Cương
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Vị trí đẹp nhất, nhiều người xem
                    </div>
                  </div>
                </label>
              </RadioGroup>
            </section>

            {/* Hình ảnh */}
            <section className="bg-card rounded-lg p-4 md:p-6 space-y-4">
              <h2 className="text-lg font-semibold">Hình ảnh bất động sản</h2>
              <p className="text-sm text-muted-foreground">
                Tối đa 20 ảnh. Mỗi ảnh không quá 5MB. Định dạng: JPG, PNG,
                WEBP, GIF.
              </p>

              <div className="flex flex-col gap-4">
                <div className="flex flex-wrap gap-3">
                  {imagePreviewUrls.map((url, index) => (
                    <div
                      key={index}
                      className="relative w-24 h-24 rounded-md overflow-hidden border"
                    >
                      <img
                        src={url}
                        alt={`Ảnh ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-1 right-1 w-6 h-6 rounded-full bg-black/60 text-white flex items-center justify-center"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>

                <label className="flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-primary/40 px-4 py-6 cursor-pointer hover:bg-primary/5">
                  <Upload className="w-6 h-6 text-primary" />
                  <div className="text-sm font-medium">
                    Nhấn để chọn ảnh hoặc kéo thả vào đây
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Tối đa 20 ảnh, mỗi ảnh ≤ 5MB
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={handleImageUpload}
                  />
                </label>
              </div>
            </section>

            <Button
              type="submit"
              size="lg"
              className="w-full md:w-auto"
              disabled={isSubmitting}
            >
              {isSubmitting && (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              )}
              Đăng tin
            </Button>
          </form>

          <div className="mt-6 text-sm text-muted-foreground flex items-center gap-2">
            <Phone className="w-4 h-4" />
            Mọi thắc mắc về đăng tin vui lòng liên hệ{" "}
            <span className="font-semibold text-foreground">
              099 666 8800
            </span>
          </div>
        </div>
      </div>
    </Layout>
  );
}
