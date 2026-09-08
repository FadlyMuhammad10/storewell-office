"use client";
import { Badge } from "@/components/ui/badge";
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
import { formatPrice, getDiscountedPrice } from "@/lib/utils";
import { setCartCount } from "@/redux/slices/cartSlice";
import { RootState } from "@/redux/store";
import {
  getCartsCount,
  getCities,
  getCost,
  getDistricts,
  getProvinces,
  postCheckout,
} from "@/services/participant";
import { CheckoutRequest, CostPayload } from "@/types";
import {
  CartItem,
  CityItem,
  CostItem,
  DistrictItem,
  ProvinceItem,
} from "@/types/interface";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";

function getCheckoutItemPrice(item: CartItem) {
  return getDiscountedPrice(
    item.variant_price,
    item.discount,
    item.final_price,
  );
}

function CheckoutItemPrice({ item }: { item: CartItem }) {
  const { finalPrice, discountLabel } = getCheckoutItemPrice(item);

  return (
    <div className="flex flex-wrap items-center gap-2 text-sm">
      <span className="font-light text-primary">{formatPrice(finalPrice)}</span>
      {discountLabel && (
        <>
          <span className="text-xs text-muted-foreground line-through">
            {formatPrice(item.variant_price)}
          </span>
          <span className="text-xs font-semibold text-red-500">
            {discountLabel}
          </span>
        </>
      )}
    </div>
  );
}

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
  const dispatch = useDispatch();

  const subtotalPrice = itemsCheckout.reduce(
    (total, item) => total + getCheckoutItemPrice(item).finalPrice * item.qty,
    0,
  );

  const totalPrice = subtotalPrice + costs.cost;

  const form = useForm({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      email: "",
      first_name: "",
      last_name: "",
      phone_number: "",
      postal_code: "",
      address: "",
      cart_items: itemsCheckout.map((item) => ({ cart_id: item.id })) as [
        { cart_id: number },
      ],
    },
  });

  useEffect(() => {
    form.setValue(
      "cart_items",
      itemsCheckout.map((item) => ({ cart_id: item.id })) as [
        { cart_id: number },
      ],
    );
  }, [form, itemsCheckout, subtotalPrice, totalPrice]);

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
          token!,
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
      (item) => item.id.toString() === province_id,
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
    : "Enter your address to shipping estimate";

  const formSubmit = async (data: unknown) => {
    const checkoutData = {
      ...(data as CheckoutRequest),
      nominal_amount: subtotalPrice,
      final_amount: totalPrice,
      cart_items: itemsCheckout.map((item) => ({ cart_id: item.id })) as [
        { cart_id: number },
      ],
    };
    setIsSubmitting(true);

    try {
      const res = await postCheckout(checkoutData, token!);
      const orderCode = res.data.order_code;

      const count = await getCartsCount(token!);
      dispatch(setCartCount(count.data.count));

      window.location.href = `/orders/${orderCode}`;
    } catch (error) {
      console.log("error", error);
      setIsSubmitting(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="page-container py-16">
      <form
        className="grid gap-6 lg:grid-cols-3 "
        onSubmit={form.handleSubmit(
          (data) => {
            console.log("Valid", data);
            formSubmit(data);
          },
          (errors) => {
            console.log("Invalid", errors);
          },
        )}
      >
        <div className="lg:col-span-2 tracking-wide">
          <div className="space-y-4">
            <div className="mb-8">
              <h1 className="text-3xl font-medium text-primary ">Checkout</h1>
              <p className="text-muted-foreground font-normal">
                Review your information to complete your order.
              </p>
            </div>
            <div className="inline-flex gap-2">
              <Badge className=" text-primary h-7 w-7 flex items-center justify-center p-0 text-xs bg-secondary font-medium">
                01
              </Badge>
              <h2 className="font-normal capitalize text-primary text-xl">
                Shipping Address
              </h2>
            </div>
            <div className="flex flex-col gap-2">
              <Label
                htmlFor="email"
                className="text-xs font-medium text-primary uppercase"
              >
                Email Address
              </Label>
              <Input
                id="email"
                placeholder="alex@gmail.com"
                className="border border-border text-primary"
                {...form.register("email")}
              />
            </div>
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="flex flex-col gap-2">
                <Label
                  htmlFor="firstName"
                  className="text-xs font-medium text-primary uppercase"
                >
                  First Name
                </Label>
                <Input
                  id="firstName"
                  placeholder="Alex"
                  className="border border-border text-primary"
                  {...form.register("first_name")}
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label
                  htmlFor="lastName"
                  className="text-xs font-medium text-primary uppercase"
                >
                  Last Name
                </Label>
                <Input
                  id="lastName"
                  placeholder="Rivers"
                  className="border border-border text-primary"
                  {...form.register("last_name")}
                />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <Label
                htmlFor="address"
                className="text-xs font-medium text-primary uppercase"
              >
                Street Address
              </Label>
              <Input
                id="address"
                placeholder="123 Minimalism Way"
                className="border border-border text-primary"
                {...form.register("address")}
              />
            </div>
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="flex flex-col gap-2">
                <Label className="text-xs font-medium text-primary uppercase">
                  Province
                </Label>
                <Select
                  value={selectedProvince.province_id}
                  onValueChange={handleProvinceChange}
                >
                  <SelectTrigger className="w-full border border-border text-primary">
                    <SelectValue placeholder="Select Province" />
                  </SelectTrigger>
                  <SelectContent>
                    {provinces &&
                      provinces.map((item) => (
                        <SelectItem
                          key={item.id}
                          value={item.id.toString()}
                          className="focus:bg-primary"
                        >
                          {item.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-col gap-2">
                <Label className="text-xs font-medium text-primary uppercase">
                  City
                </Label>
                <Select
                  value={selectedCity.city_id}
                  onValueChange={handleCityChange}
                >
                  <SelectTrigger className="w-full border border-border text-primary">
                    <SelectValue
                      placeholder={
                        selectedProvince.province_id
                          ? "Select City"
                          : "Select Province first"
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {city &&
                      city.map((item) => (
                        <SelectItem
                          key={item.id}
                          value={item.id.toString()}
                          className="focus:bg-primary"
                        >
                          {item.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="flex flex-col gap-2">
                <Label className="text-xs font-medium text-primary uppercase">
                  subdistrict
                </Label>
                <Select
                  value={selectedDistrict.district_id}
                  onValueChange={handleDistrictChange}
                >
                  <SelectTrigger className="w-full border border-border text-primary">
                    <SelectValue
                      placeholder={
                        selectedCity.city_id
                          ? "Select Subdistrict"
                          : "Select City first"
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {district &&
                      district.map((item) => (
                        <SelectItem
                          key={item.id}
                          value={item.id.toString()}
                          className="focus:bg-primary"
                        >
                          {item.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-col gap-2">
                <Label
                  htmlFor="postalCode"
                  className="text-xs font-medium text-primary uppercase"
                >
                  Postal Code
                </Label>
                <Input
                  id="postalCode"
                  placeholder="10001"
                  className="border border-border text-primary"
                  {...form.register("postal_code")}
                />
              </div>
            </div>
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="flex flex-col gap-2">
                <Label
                  htmlFor="phone_number"
                  className="text-xs font-medium text-primary uppercase"
                >
                  Phone Number
                </Label>
                <Input
                  id="phone_number"
                  placeholder="6281234589"
                  className="border border-border text-primary"
                  {...form.register("phone_number")}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="relative">
          <Card className="bg-[#F5F3F3] border-none shadow-sm sticky top-24 p-6 h-fit tracking-tight">
            <h2 className="font-normal capitalize text-primary text-xl">
              Order Summary
            </h2>

            <div className="pb-4 border-b border-[#C4C7C7]">
              <div className="space-y-2">
                {itemsCheckout.length > 0 ? (
                  itemsCheckout.map((item, i) => (
                    <div key={i} className="grid grid-cols-1 md:grid-cols-3">
                      <div className="relative aspect-3/4 w-20 bg-transparent rounded-lg overflow-hidden">
                        <Image
                          fill
                          src={item.image_url || "/default-image.png"}
                          alt={item.product_name}
                          className="object-cover"
                        />
                      </div>
                      <div className="flex flex-col justify-between">
                        <div className="flex flex-col">
                          <h3 className="font-semibold capitalize text-primary">
                            {item.product_name}
                          </h3>
                          <div className="flex flex-wrap gap-1 text-xs text-primary-foreground font-medium uppercase">
                            {item.combinations?.map((combination, index) => (
                              <span key={index} className="font-medium">
                                {index > 0 && " | "}
                                {combination.variant_value_name}
                              </span>
                            ))}
                          </div>
                        </div>
                        <CheckoutItemPrice item={item} />
                      </div>
                      <span className="text-primary-foreground">
                        {item.qty}x
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
                <span className="text-primary-foreground text-sm font-light">
                  Subtotal{" "}
                </span>
                <span className="font-medium text-sm text-primary">
                  {formatPrice(subtotalPrice)}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-primary-foreground text-sm font-light">
                  Shipping
                </span>
                <span className="font-medium text-sm text-primary">
                  {shippingLabel}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-primary-foreground text-sm font-light">
                  Tax (0%)
                </span>
                <span className="font-medium text-sm text-primary">
                  {formatPrice(0)}
                </span>
              </div>

              <div className="w-full border-t border-[#C4C7C7]" />

              <div className="flex justify-between text-lg">
                <span className="font-normal text-primary text-lg">TOTAL</span>
                <span className="font-normal text-primary">
                  {formatPrice(totalPrice)}
                </span>
              </div>
            </div>
            <div className="pt-2">
              <Button
                type="submit"
                size="lg"
                disabled={isSubmitting}
                className="w-full bg-primary hover:bg-primary/90 text-white font-bold mb-4 uppercase"
              >
                {isSubmitting ? "Proceed to payment..." : "Place order"}
              </Button>
            </div>
          </Card>
        </div>
      </form>
    </div>
  );
}
