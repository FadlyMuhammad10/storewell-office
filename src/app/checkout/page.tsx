"use client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { checkoutSchema } from "@/lib/schema";
import { formatPrice } from "@/lib/utils";
import { RootState } from "@/redux/store";
import {
  getCities,
  getCost,
  getDistricts,
  getProvinces,
  postCheckout,
} from "@/services/participant";
import { CheckoutRequest, CostPayload } from "@/types";
import {
  CityItem,
  CostItem,
  DistrictItem,
  ProvinceItem,
} from "@/types/interface";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import z from "zod";

export default function CheckoutPage() {
  const token = useSelector((state: RootState) => state.auth.token);
  const itemsCheckout = useSelector((state: RootState) => state.checkout.items);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [provinces, setProvince] = useState<ProvinceItem[]>([]);
  const [city, setCity] = useState<CityItem[]>([]);
  const [district, setDistrict] = useState<DistrictItem[]>([]);
  const [selectedProvince, setSelectedProvince] = useState({
    province_id: "",
    province: "",
  });
  const [selectedCity, setSelectedCity] = useState({
    city_id: "",
    city_name: "",
  });
  const [selectedDistrict, setSelectedDistrict] = useState({
    district_id: "",
    district_name: "",
  });
  const [costs, setCosts] = useState<CostItem>({
    service: "",
    description: "",
    cost: 0,
    etd: "",
  });

  const subtotalPrice = itemsCheckout.reduce(
    (total, item) => total + item.product.price! * item.quantity,
    0
  );

  const totalPrice = subtotalPrice + costs.cost;

  const form = useForm({
    resolver: zodResolver(checkoutSchema),
    values: {
      name: "",
      phone: "",
      address: "",
      postalcode: "",
    },
  });

  useEffect(() => {
    const fetchProvince = async () => {
      try {
        const res = await getProvinces(token!);
        setProvince(res?.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchProvince();
  }, [token]);

  useEffect(() => {
    const fetchCity = async () => {
      // Hanya fetch jika province_id sudah ada
      if (!selectedProvince.province_id) {
        setCity([]); // Reset city jika province belum dipilih
        return;
      }

      try {
        const res = await getCities(
          Number(selectedProvince.province_id),
          token!
        );
        setCity(res?.data);
      } catch (error) {
        console.log(error);
        setCity([]);
      }
    };

    fetchCity();
  }, [selectedProvince.province_id, token]);

  useEffect(() => {
    const fetchDistrict = async () => {
      // Hanya fetch jika city_id sudah ada
      if (!selectedCity.city_id) {
        setDistrict([]); // Reset city jika province belum dipilih
        return;
      }

      try {
        const res = await getDistricts(Number(selectedCity.city_id), token!);
        setDistrict(res?.data);
      } catch (error) {
        console.log(error);
        setDistrict([]);
      }
    };

    fetchDistrict();
  }, [selectedCity.city_id, token]);

  const handleProvinceChange = (province_id: string) => {
    const selected = provinces.find(
      (item) => item.id.toString() === province_id
    );
    if (selected) {
      setSelectedProvince({
        province_id: selected.id.toString(),
        province: selected.name,
      });

      setSelectedCity({ city_id: "", city_name: "" });
      setSelectedDistrict({ district_id: "", district_name: "" });
    }
  };

  const handleCityChange = (city_id: string) => {
    const selected = city.find((item) => item.id.toString() === city_id);
    if (selected) {
      setSelectedCity({
        city_id: selected.id.toString(),
        city_name: selected.name,
      });

      setSelectedDistrict({ district_id: "", district_name: "" });
    }
  };

  const handleDistrictChange = (city_id: string) => {
    const selected = district.find((item) => item.id.toString() === city_id);
    if (selected) {
      setSelectedDistrict({
        district_id: selected.id.toString(),
        district_name: selected.name,
      });
    }
  };

  useEffect(() => {
    const fetchCost = async () => {
      // Hanya fetch jika city_id sudah ada
      if (!selectedDistrict.district_id) {
        setCosts({
          service: "",
          description: "",
          cost: 0,
          etd: "",
        }); // Reset city jika province belum dipilih
        return;
      }

      try {
        const data: CostPayload = {
          origin: 3829,
          destination: parseInt(selectedDistrict.district_id),
          weight: 100,
          courier: "jne",
        };
        const res = await getCost(data, token!);
        setCosts(res.data[0]);
      } catch (error) {
        console.log(error);
        setCosts({
          service: "",
          description: "",
          cost: 0,
          etd: "",
        });
      }
    };

    fetchCost();
  }, [selectedDistrict.district_id, token]);

  const shippingLabel = selectedDistrict.district_id
    ? formatPrice(costs.cost)
    : "Isi alamat untuk estimasi ongkir";

  const formSubmit = async (data: z.infer<typeof checkoutSchema>) => {
    try {
      const payload: CheckoutRequest = {
        ...data,
        cart_item: itemsCheckout.map((item) => Number(item.id)),
        origin_id: 3829,
        gross_amount: totalPrice,
        weight: 100,
        courier: "jne",
        destination_id: parseInt(selectedDistrict.district_id),
        city_name: selectedCity.city_name,
        province_name: selectedProvince.province,
        district_name: selectedDistrict.district_name,
        courier_service: costs.service,
        shipping_cost: costs.cost,
      };

      const res = await postCheckout(payload, token!);

      window.location.href = res.data.redirect_url;
    } catch (error) {
      console.log("error", error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground text-balance">
          Checkout
        </h1>
        <p className="text-muted-foreground">
          Lengkapi detail pengiriman anda.
        </p>
      </div>
      <div className="grid gap-8 lg:grid-cols-3">
        {/* Shipping Form */}
        <Card className="lg:col-span-2 p-6 border-2 border-border">
          <form className="space-y-6" onSubmit={form.handleSubmit(formSubmit)}>
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="flex flex-col gap-2">
                <Label htmlFor="fullName">Nama Lengkap</Label>
                <Input
                  id="fullName"
                  placeholder="Nama sesuai pengiriman"
                  {...form.register("name")}
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="phone">No. HP</Label>
                <Input
                  id="phone"
                  placeholder="08xxxxxxxxxx"
                  {...form.register("phone")}
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="address">Alamat Lengkap</Label>
              <Input
                id="address"
                placeholder="Nama jalan, rt/rw, kecamatan"
                {...form.register("address")}
              />
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              <div className="flex flex-col gap-2">
                <Label>Provinsi</Label>
                <Select
                  value={selectedProvince.province_id}
                  onValueChange={handleProvinceChange}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Pilih provinsi" />
                  </SelectTrigger>
                  <SelectContent>
                    {provinces &&
                      provinces.map((item) => (
                        <SelectItem key={item.id} value={item.id.toString()}>
                          {item.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-col gap-2">
                <Label>Kota/Kabupaten</Label>
                <Select
                  value={selectedCity.city_id}
                  onValueChange={handleCityChange}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue
                      placeholder={
                        selectedProvince.province_id
                          ? "Pilih kota"
                          : "Pilih provinsi dulu"
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {city &&
                      city.map((item) => (
                        <SelectItem key={item.id} value={item.id.toString()}>
                          {item.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="flex flex-col gap-2">
                <Label>Kecamatan</Label>
                <Select
                  value={selectedDistrict.district_id}
                  onValueChange={handleDistrictChange}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue
                      placeholder={
                        selectedCity.city_id
                          ? "Pilih kecamatan"
                          : "Pilih kota dulu"
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {district &&
                      district.map((item) => (
                        <SelectItem key={item.id} value={item.id.toString()}>
                          {item.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="postalCode">Kode Pos</Label>
                <Input
                  id="postalCode"
                  placeholder="Kode pos"
                  {...form.register("postalcode")}
                />
              </div>
            </div>

            <div className="pt-2">
              <Button
                type="submit"
                size="lg"
                disabled={isSubmitting}
                className="font-bold bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-60"
              >
                {isSubmitting
                  ? "Mengalihkan ke pembayaran..."
                  : "Lanjutkan Pembayaran"}
              </Button>
            </div>
          </form>
        </Card>

        {/* Order Summary */}
        <Card className="p-6 border-2 border-border h-fit lg:sticky lg:top-4">
          <h2 className="text-xl font-bold text-foreground mb-6">
            Ringkasan Pesanan
          </h2>

          <div className="mb-6 pb-4 border-b border-border">
            <h3 className="text-sm font-semibold text-muted-foreground mb-3">
              Item Terpilih ({itemsCheckout.length})
            </h3>
            <div className="space-y-2">
              {itemsCheckout.length > 0 ? (
                itemsCheckout.map((item, i) => (
                  <div key={i} className="flex justify-between text-sm">
                    <span className="text-foreground">{item.product.name}</span>
                    <span className="text-muted-foreground">
                      {item.quantity}x
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground italic">
                  Tidak ada item terpilih
                </p>
              )}
            </div>
          </div>

          <div className="space-y-4 mb-6">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Subtotal </span>
              <span className="font-medium">{formatPrice(subtotalPrice)}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-muted-foreground">Ongkir</span>
              <span className="font-medium">{shippingLabel}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-muted-foreground">Pajak (0%)</span>
              <span className="font-medium">{formatPrice(0)}</span>
            </div>

            <hr className="border-border" />

            <div className="flex justify-between text-lg">
              <span className="font-bold text-foreground">TOTAL</span>
              <span className="font-bold text-foreground">
                {formatPrice(totalPrice)}
              </span>
            </div>
          </div>

          <p className="text-sm text-muted-foreground">
            Ongkir final akan dihitung berdasarkan provinsi dan kota yang
            dipilih beserta kurir pada langkah berikutnya.
          </p>
        </Card>
      </div>
    </div>
  );
}
