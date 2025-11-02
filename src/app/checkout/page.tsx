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
import { formatPrice } from "@/lib/utils";
import { useState } from "react";

export default function CheckoutPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);

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
          <form className="space-y-6">
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="flex flex-col gap-2">
                <Label htmlFor="fullName">Nama Lengkap</Label>
                <Input id="fullName" placeholder="Nama sesuai pengiriman" />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="phone">No. HP</Label>
                <Input id="phone" placeholder="08xxxxxxxxxx" />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="address">Alamat Lengkap</Label>
              <Input id="address" placeholder="Nama jalan, rt/rw, kecamatan" />
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              <div className="flex flex-col gap-2">
                <Label>Provinsi</Label>
                <Select>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Pilih provinsi" />
                  </SelectTrigger>
                  <SelectContent>
                    {/* {provinces &&
                      provinces.map((item) => (
                        <SelectItem key={item.id} value={item.id}>
                          {item.name}
                        </SelectItem>
                      ))} */}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-col gap-2">
                <Label>Kota/Kabupaten</Label>
                <Select>
                  <SelectTrigger className="w-full">
                    <SelectValue
                    //   placeholder={
                    //     selectedProvince.province_id
                    //       ? "Pilih kota"
                    //       : "Pilih provinsi dulu"
                    //   }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {/* {city &&
                      city.map((item) => (
                        <SelectItem key={item.id} value={item.id}>
                          {item.name}
                        </SelectItem>
                      ))} */}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="flex flex-col gap-2">
                <Label>Kecamatan</Label>
                <Select>
                  <SelectTrigger className="w-full">
                    <SelectValue
                    //   placeholder={
                    //     selectedCity.city_id
                    //       ? "Pilih kecamatan"
                    //       : "Pilih kota dulu"
                    //   }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {/* {district &&
                      district.map((item) => (
                        <SelectItem key={item.id} value={item.id}>
                          {item.name}
                        </SelectItem>
                      ))} */}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="postalCode">Kode Pos</Label>
                <Input id="postalCode" placeholder="Kode pos" />
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

          <div className="space-y-4 mb-6">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Subtotal ({4} item)</span>
              <span className="font-medium">{formatPrice(5000)}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-muted-foreground">Ongkir</span>
              <span className="font-medium">{5000}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-muted-foreground">Pajak (0%)</span>
              <span className="font-medium">{formatPrice(0)}</span>
            </div>

            <hr className="border-border" />

            <div className="flex justify-between text-lg">
              <span className="font-bold text-foreground">TOTAL</span>
              <span className="font-bold text-foreground">
                {formatPrice(5000)}
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
