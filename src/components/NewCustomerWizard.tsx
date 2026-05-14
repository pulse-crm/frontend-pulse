import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog/dialog";
import { Button } from "@/components/ui/button/button";
import { Input } from "@/components/ui/input/input";
import { Label } from "@/components/ui/label/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio/radio-group";
import { Checkbox } from "@/components/ui/checkbox/checkbox";
import { Card, CardContent } from "@/components/ui/card/card";
import { Separator } from "@/components/ui/separator/separator";
import { Badge } from "@/components/ui/badge/badge";
import { Spinner } from "@/components/ui/spinner/spinner";
import { toast } from "@/components/ui/toast/toaster";
import {
  formatCurrency,
  getEmailError,
  getPhoneError,
  getPostcodeError,
} from "@/lib/format";
import {
  User,
  MapPin,
  Package,
  PoundSterling,
  CreditCard,
  CheckCircle2,
  ArrowLeft,
  ArrowRight,
} from "lucide-react";
import { cn } from "@/lib/cn";
import { products } from "@/data/mock";

interface NewCustomerWizardProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const STEPS = [
  { label: "Customer Details", icon: User },
  { label: "Package Selection", icon: Package },
  { label: "Pricing & Terms", icon: PoundSterling },
  { label: "Payment", icon: CreditCard },
  { label: "Confirmation", icon: CheckCircle2 },
];

const COMMITMENTS = ["Month-to-Month", "12 Months", "24 Months", "36 Months"];

export function NewCustomerWizard({ open, onOpenChange }: NewCustomerWizardProps) {
  const [step, setStep] = React.useState(0);
  const [processing, setProcessing] = React.useState(false);
  const [orderComplete, setOrderComplete] = React.useState(false);

  const [customerType, setCustomerType] = React.useState<"B2C" | "B2B">("B2C");
  const [title, setTitle] = React.useState("");
  const [firstName, setFirstName] = React.useState("");
  const [lastName, setLastName] = React.useState("");
  const [companyName, setCompanyName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [addressLine1, setAddressLine1] = React.useState("");
  const [addressLine2, setAddressLine2] = React.useState("");
  const [city, setCity] = React.useState("");
  const [county, setCounty] = React.useState("");
  const [postcode, setPostcode] = React.useState("");

  const [selectedProducts, setSelectedProducts] = React.useState<string[]>([]);
  const [commitment, setCommitment] = React.useState("24 Months");

  const [paymentMethod, setPaymentMethod] = React.useState<"card" | "directdebit">("directdebit");
  const [cardNumber, setCardNumber] = React.useState("");
  const [cardExpiry, setCardExpiry] = React.useState("");
  const [cardCvc, setCardCvc] = React.useState("");
  const [cardName, setCardName] = React.useState("");
  const [sortCode, setSortCode] = React.useState("");
  const [accountNumber, setAccountNumber] = React.useState("");
  const [accountName, setAccountName] = React.useState("");

  const selectedProductsList = products.filter((p) => selectedProducts.includes(p.id));
  const monthlyTotal = selectedProductsList.reduce((s, p) => s + p.price, 0);

  const resetWizard = () => {
    setStep(0);
    setProcessing(false);
    setOrderComplete(false);
    setCustomerType("B2C");
    setTitle("");
    setFirstName("");
    setLastName("");
    setCompanyName("");
    setEmail("");
    setPhone("");
    setAddressLine1("");
    setAddressLine2("");
    setCity("");
    setCounty("");
    setPostcode("");
    setSelectedProducts([]);
    setCommitment("24 Months");
    setPaymentMethod("directdebit");
    setCardNumber("");
    setCardExpiry("");
    setCardCvc("");
    setCardName("");
    setSortCode("");
    setAccountNumber("");
    setAccountName("");
  };

  const handleClose = () => {
    resetWizard();
    onOpenChange(false);
  };

  const canProceed = () => {
    switch (step) {
      case 0:
        if (customerType === "B2B" && !companyName.trim()) return false;
        if (!firstName.trim() || !lastName.trim()) return false;
        if (getEmailError(email)) return false;
        if (getPhoneError(phone)) return false;
        if (!addressLine1.trim() || !city.trim()) return false;
        if (getPostcodeError(postcode)) return false;
        return true;
      case 1:
        return selectedProducts.length > 0;
      case 2:
        return !!commitment;
      case 3:
        if (paymentMethod === "card")
          return !!(cardNumber.trim() && cardExpiry.trim() && cardCvc.trim() && cardName.trim());
        return !!(sortCode.trim() && accountNumber.trim() && accountName.trim());
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (step < 4) setStep(step + 1);
  };

  const handleSubmitOrder = () => {
    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      setOrderComplete(true);
      toast({ title: "Customer created", variant: "success", description: "Order submitted successfully" });
    }, 2200);
  };

  const toggleProduct = (id: string) => {
    setSelectedProducts((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  const displayName = customerType === "B2B" ? companyName : `${firstName} ${lastName}`.trim();

  return (
    <Dialog open={open} onOpenChange={(o) => (o ? onOpenChange(true) : handleClose())}>
      <DialogContent className="max-w-4xl max-h-[95vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>New Customer</DialogTitle>
        </DialogHeader>

        {/* Step indicator */}
        <div className="flex items-center gap-1 mb-4">
          {STEPS.map((s, i) => {
            const Icon = s.icon;
            const isActive = i === step;
            const isDone = i < step || orderComplete;
            return (
              <div key={i} className="flex items-center flex-1">
                <div
                  className={cn(
                    "flex items-center gap-1.5 px-2 py-1.5 rounded-md text-xs font-medium w-full justify-center transition-colors",
                    isActive && "bg-primary text-primary-foreground",
                    isDone && !isActive && "bg-primary/10 text-primary",
                    !isActive && !isDone && "bg-muted text-muted-foreground"
                  )}
                >
                  <Icon className="h-3.5 w-3.5 shrink-0" />
                  <span className="hidden sm:inline truncate">{s.label}</span>
                </div>
              </div>
            );
          })}
        </div>

        <Separator />

        {step === 0 && (
          <div className="space-y-4 pt-2">
            <div>
              <Label className="text-xs font-medium mb-2 block">Customer Type</Label>
              <RadioGroup
                value={customerType}
                onValueChange={(v) => setCustomerType(v as "B2C" | "B2B")}
                className="flex gap-4"
              >
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="B2C" id="b2c" />
                  <Label htmlFor="b2c" className="text-sm cursor-pointer">Residential</Label>
                </div>
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="B2B" id="b2b" />
                  <Label htmlFor="b2b" className="text-sm cursor-pointer">Business</Label>
                </div>
              </RadioGroup>
            </div>

            {customerType === "B2B" && (
              <div>
                <Label htmlFor="company" className="text-xs">Company Name *</Label>
                <Input
                  id="company"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="Company name"
                  className="mt-1"
                />
              </div>
            )}

            <div className="grid grid-cols-4 gap-3">
              <div>
                <Label className="text-xs">Title</Label>
                <Select value={title} onValueChange={setTitle}>
                  <SelectTrigger className="mt-1"><SelectValue placeholder="--" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Mr">Mr</SelectItem>
                    <SelectItem value="Mrs">Mrs</SelectItem>
                    <SelectItem value="Ms">Ms</SelectItem>
                    <SelectItem value="Miss">Miss</SelectItem>
                    <SelectItem value="Dr">Dr</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="col-span-1">
                <Label htmlFor="firstName" className="text-xs">First Name *</Label>
                <Input
                  id="firstName"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="First name"
                  className="mt-1"
                />
              </div>
              <div className="col-span-2">
                <Label htmlFor="lastName" className="text-xs">Last Name *</Label>
                <Input
                  id="lastName"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Last name"
                  className="mt-1"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="email" className="text-xs">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="email@example.com"
                  className="mt-1"
                />
                {email && getEmailError(email) && (
                  <p className="text-[10px] text-destructive mt-1">{getEmailError(email)}</p>
                )}
              </div>
              <div>
                <Label htmlFor="phone" className="text-xs">Phone *</Label>
                <Input
                  id="phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+44 1234 567890"
                  className="mt-1"
                />
                {phone && getPhoneError(phone) && (
                  <p className="text-[10px] text-destructive mt-1">{getPhoneError(phone)}</p>
                )}
              </div>
            </div>

            <Separator />

            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <MapPin className="h-4 w-4" /> Installation Address
            </div>

            <div>
              <Label htmlFor="addr1" className="text-xs">Address Line 1 *</Label>
              <Input
                id="addr1"
                value={addressLine1}
                onChange={(e) => setAddressLine1(e.target.value)}
                placeholder="House number and street"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="addr2" className="text-xs">Address Line 2</Label>
              <Input
                id="addr2"
                value={addressLine2}
                onChange={(e) => setAddressLine2(e.target.value)}
                placeholder="Flat, suite, floor (optional)"
                className="mt-1"
              />
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <Label htmlFor="city" className="text-xs">City / Town *</Label>
                <Input
                  id="city"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="City"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="county" className="text-xs">County</Label>
                <Input
                  id="county"
                  value={county}
                  onChange={(e) => setCounty(e.target.value)}
                  placeholder="County"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="postcode" className="text-xs">Postcode *</Label>
                <Input
                  id="postcode"
                  value={postcode}
                  onChange={(e) => setPostcode(e.target.value)}
                  placeholder="SW1A 1AA"
                  className="mt-1"
                />
                {postcode && getPostcodeError(postcode) && (
                  <p className="text-[10px] text-destructive mt-1">{getPostcodeError(postcode)}</p>
                )}
              </div>
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="space-y-3 pt-2">
            <p className="text-sm text-muted-foreground">Select one or more products for this customer.</p>
            <div className="grid grid-cols-1 gap-2">
              {products.map((p) => {
                const isSelected = selectedProducts.includes(p.id);
                return (
                  <Card
                    key={p.id}
                    className={cn(
                      "cursor-pointer transition-all",
                      isSelected ? "border-primary bg-primary/5 shadow-sm" : "hover:border-primary/40"
                    )}
                    onClick={() => toggleProduct(p.id)}
                  >
                    <CardContent className="p-3 flex items-center gap-3">
                      <Checkbox checked={isSelected} className="pointer-events-none" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-sm">{p.name}</span>
                          <Badge variant="secondary" className="text-[10px]">{p.category}</Badge>
                        </div>
                        {p.description && (
                          <p className="text-xs text-muted-foreground mt-0.5">{p.description}</p>
                        )}
                      </div>
                      <span className="font-semibold text-sm shrink-0">
                        {formatCurrency(p.price)}/mo
                      </span>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4 pt-2">
            <div>
              <Label className="text-xs font-medium mb-2 block">Contract Length</Label>
              <RadioGroup value={commitment} onValueChange={setCommitment} className="grid grid-cols-2 gap-2">
                {COMMITMENTS.map((c) => (
                  <label
                    key={c}
                    htmlFor={c}
                    className={cn(
                      "flex items-center gap-2 border rounded-md p-3 cursor-pointer transition-colors",
                      commitment === c ? "border-primary bg-primary/5" : "border-border hover:border-primary/30"
                    )}
                  >
                    <RadioGroupItem value={c} id={c} />
                    <span className="text-sm flex-1">{c}</span>
                    {c !== "Month-to-Month" && (
                      <Badge variant="outline" className="text-[10px]">
                        {c === "36 Months" ? "Best value" : c === "24 Months" ? "Popular" : "Flexible"}
                      </Badge>
                    )}
                  </label>
                ))}
              </RadioGroup>
            </div>

            <Separator />

            <div>
              <h3 className="text-sm font-medium mb-3">Order Summary</h3>
              <div className="space-y-2">
                {selectedProductsList.map((p) => (
                  <div key={p.id} className="flex justify-between text-sm">
                    <span>{p.name}</span>
                    <span>{formatCurrency(p.price)}/mo</span>
                  </div>
                ))}
                <Separator />
                <div className="flex justify-between font-semibold">
                  <span>Monthly Total</span>
                  <span>{formatCurrency(monthlyTotal)}/mo</span>
                </div>
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Commitment</span>
                  <span>{commitment}</span>
                </div>
                {commitment !== "Month-to-Month" && (
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Total Contract Value</span>
                    <span>{formatCurrency(monthlyTotal * parseInt(commitment, 10))}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4 pt-2">
            <div>
              <Label className="text-xs font-medium mb-2 block">Payment Method</Label>
              <RadioGroup
                value={paymentMethod}
                onValueChange={(v) => setPaymentMethod(v as "card" | "directdebit")}
                className="flex gap-4"
              >
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="directdebit" id="dd" />
                  <Label htmlFor="dd" className="text-sm cursor-pointer">Direct Debit</Label>
                </div>
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="card" id="cc" />
                  <Label htmlFor="cc" className="text-sm cursor-pointer">Credit / Debit Card</Label>
                </div>
              </RadioGroup>
            </div>

            <Separator />

            {paymentMethod === "directdebit" && (
              <div className="space-y-3">
                <div>
                  <Label htmlFor="accName" className="text-xs">Account Holder Name *</Label>
                  <Input
                    id="accName"
                    value={accountName}
                    onChange={(e) => setAccountName(e.target.value)}
                    placeholder="Name as shown on account"
                    className="mt-1"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="sortCode" className="text-xs">Sort Code *</Label>
                    <Input
                      id="sortCode"
                      value={sortCode}
                      onChange={(e) => setSortCode(e.target.value)}
                      placeholder="00-00-00"
                      maxLength={8}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="accNum" className="text-xs">Account Number *</Label>
                    <Input
                      id="accNum"
                      value={accountNumber}
                      onChange={(e) => setAccountNumber(e.target.value)}
                      placeholder="12345678"
                      maxLength={8}
                      className="mt-1"
                    />
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">
                  Your payments are protected by the Direct Debit Guarantee.
                </p>
              </div>
            )}

            {paymentMethod === "card" && (
              <div className="space-y-3">
                <div>
                  <Label htmlFor="cardName" className="text-xs">Name on Card *</Label>
                  <Input
                    id="cardName"
                    value={cardName}
                    onChange={(e) => setCardName(e.target.value)}
                    placeholder="Full name on card"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="cardNum" className="text-xs">Card Number *</Label>
                  <Input
                    id="cardNum"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    placeholder="•••• •••• •••• ••••"
                    maxLength={19}
                    className="mt-1"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="expiry" className="text-xs">Expiry *</Label>
                    <Input
                      id="expiry"
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value)}
                      placeholder="MM/YY"
                      maxLength={5}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="cvc" className="text-xs">CVC *</Label>
                    <Input
                      id="cvc"
                      value={cardCvc}
                      onChange={(e) => setCardCvc(e.target.value)}
                      placeholder="•••"
                      maxLength={4}
                      className="mt-1"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {step === 4 && !orderComplete && !processing && (
          <div className="space-y-4 pt-2">
            <h3 className="text-sm font-medium">Review Your Order</h3>
            <Card>
              <CardContent className="p-4 space-y-3 text-sm">
                <div>
                  <span className="text-xs text-muted-foreground">Customer</span>
                  <p className="font-medium">{displayName}</p>
                  <p className="text-xs text-muted-foreground">{email} · {phone}</p>
                </div>
                <Separator />
                <div>
                  <span className="text-xs text-muted-foreground">Installation Address</span>
                  <p>{addressLine1}{addressLine2 ? `, ${addressLine2}` : ""}</p>
                  <p>{city}{county ? `, ${county}` : ""}, {postcode}</p>
                </div>
                <Separator />
                <div>
                  <span className="text-xs text-muted-foreground">Package</span>
                  {selectedProductsList.map((p) => (
                    <div key={p.id} className="flex justify-between">
                      <span>{p.name}</span>
                      <span>{formatCurrency(p.price)}/mo</span>
                    </div>
                  ))}
                  <div className="flex justify-between font-semibold mt-1 pt-1 border-t border-border">
                    <span>Monthly Total</span>
                    <span>{formatCurrency(monthlyTotal)}/mo</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Contract: {commitment}</p>
                </div>
                <Separator />
                <div>
                  <span className="text-xs text-muted-foreground">Payment</span>
                  <p>
                    {paymentMethod === "directdebit"
                      ? `Direct Debit — ****${accountNumber.slice(-4)}`
                      : `Card — ****${cardNumber.slice(-4)}`}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {step === 4 && processing && (
          <div className="flex flex-col items-center justify-center py-12 gap-4">
            <Spinner size="lg" />
            <p className="text-sm font-medium">Processing your order…</p>
            <p className="text-xs text-muted-foreground">
              Creating customer account and provisioning services
            </p>
          </div>
        )}

        {step === 4 && orderComplete && (
          <div className="flex flex-col items-center justify-center py-12 gap-4">
            <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
              <CheckCircle2 className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-lg font-semibold">Order Complete!</h3>
            <p className="text-sm text-muted-foreground text-center max-w-sm">
              Customer <strong>{displayName}</strong> has been created and their services are
              being provisioned. Order reference:{" "}
              <strong>ORD-{Math.floor(7100 + Math.random() * 900)}</strong>
            </p>
            <Button onClick={handleClose} className="mt-2">Close</Button>
          </div>
        )}

        <Separator />

        {!orderComplete && (
          <div className="flex justify-between">
            <Button
              variant="outline"
              size="sm"
              onClick={() => (step === 0 ? handleClose() : setStep(step - 1))}
              disabled={processing}
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              {step === 0 ? "Cancel" : "Back"}
            </Button>

            {step < 4 && (
              <Button size="sm" onClick={handleNext} disabled={!canProceed()}>
                Next
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            )}

            {step === 4 && !processing && (
              <Button size="sm" onClick={handleSubmitOrder}>
                <CheckCircle2 className="h-3.5 w-3.5" />
                Submit Order
              </Button>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
