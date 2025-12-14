"use client";

import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Loader2, Rocket, Zap, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { getBoostProducts, boostForm } from "@/app/actions/boost";
import { useAuth } from "@/lib/hooks/use-auth";
import { cn } from "@/lib/utils";
import type { Database } from "@/types/database";

type BoostProduct = Database["public"]["Tables"]["boost_products"]["Row"];

interface BoostDialogProps {
    formId: string;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function BoostDialog({ formId, open, onOpenChange }: BoostDialogProps) {
    const { user } = useAuth();
    const [products, setProducts] = useState<BoostProduct[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedProduct, setSelectedProduct] = useState<string>("");
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (open) {
            setLoading(true);
            getBoostProducts()
                .then((data) => {
                    setProducts(data);
                    if (data.length > 0) setSelectedProduct(data[0].id);
                })
                .catch((err) => {
                    console.error(err);
                    toast.error("Failed to load boost options");
                })
                .finally(() => setLoading(false));
        }
    }, [open]);

    const handleBoost = async () => {
        if (!selectedProduct) return;

        setSubmitting(true);
        try {
            const result = await boostForm(formId, selectedProduct);
            if (result.success) {
                toast.success(result.message);
                onOpenChange(false);
            } else {
                toast.error(result.message);
            }
        } catch (error) {
            toast.error("An unexpected error occurred");
        } finally {
            setSubmitting(false);
        }
    };

    const selectedProductDetails = products.find(p => p.id === selectedProduct);
    const currentBalance = user?.credits_balance || 0;
    const cost = selectedProductDetails?.price_credits || 0;
    const remainingParams = currentBalance - cost;
    const sufficientCredits = remainingParams >= 0;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden gap-0">
                <div className="bg-gradient-to-br from-purple-600 to-indigo-600 p-6 text-white text-center sm:text-left">
                    <div className="flex items-center gap-3 mb-2 justify-center sm:justify-start">
                        <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                            <Rocket className="w-5 h-5 text-white" />
                        </div>
                        <DialogTitle className="text-xl text-white">Boost Your Form</DialogTitle>
                    </div>
                    <DialogDescription className="text-purple-100 text-center sm:text-left">
                        Get more responses by promoting your form to the top of the feed.
                    </DialogDescription>
                </div>

                <div className="p-6">
                    {loading ? (
                        <div className="flex justify-center py-8">
                            <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
                        </div>
                    ) : products.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">
                            No boost packages available at the moment.
                        </div>
                    ) : (
                        <div className="space-y-6">
                            <RadioGroup value={selectedProduct} onValueChange={setSelectedProduct} className="grid gap-3">
                                {products.map((product) => (
                                    <Label
                                        key={product.id}
                                        className={cn(
                                            "cursor-pointer relative flex flex-col gap-2 rounded-xl border-2 p-4 transition-all hover:bg-muted/50",
                                            selectedProduct === product.id ? "border-purple-600 bg-purple-50 dark:bg-purple-900/10" : "border-border/50"
                                        )}
                                    >
                                        <RadioGroupItem value={product.id} className="sr-only" />
                                        <div className="flex justify-between items-start w-full">
                                            <div>
                                                <div className="font-semibold text-base mb-1 flex items-center gap-2">
                                                    {product.duration_hours === 24 ? "24 Hours" :
                                                        product.duration_hours === 48 ? "48 Hours" :
                                                            `${Math.floor(product.duration_hours / 24)} Days`}
                                                    {product.placement === 'pin' && <span className="text-[10px] bg-amber-500 text-white px-1.5 py-0.5 rounded-full uppercase">Top Pin</span>}
                                                </div>
                                                <div className="text-sm text-muted-foreground">{product.description}</div>
                                            </div>
                                            <div className="font-bold text-lg text-purple-600 dark:text-purple-400 shrink-0">
                                                {product.price_credits} ⚡
                                            </div>
                                        </div>
                                        {/* Expected Lift Visualization */}
                                        {product.expected_lift && typeof product.expected_lift === 'object' && (
                                            <div className="flex gap-3 mt-1 text-xs font-medium text-muted-foreground">
                                                {/* @ts-ignore */}
                                                {product.expected_lift.views && (
                                                    <span className="flex items-center gap-1 text-green-600 dark:text-green-400">
                                                        <Zap className="w-3 h-3" />
                                                        {/* @ts-ignore */}
                                                        {product.expected_lift.views} est. views
                                                    </span>
                                                )}
                                            </div>
                                        )}
                                    </Label>
                                ))}
                            </RadioGroup>

                            <div className="bg-muted/50 rounded-lg p-4 space-y-3">
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Current Balance</span>
                                    <span className="font-medium">{currentBalance} credits</span>
                                </div>
                                {selectedProductDetails && (
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">Cost</span>
                                        <span className="font-medium text-destructive">-{cost} credits</span>
                                    </div>
                                )}
                                <div className="h-px bg-border/50" />
                                <div className="flex justify-between font-semibold">
                                    <span>Remaining</span>
                                    <span className={cn(
                                        remainingParams < 0 ? "text-destructive" : "text-green-600 dark:text-green-400"
                                    )}>
                                        {remainingParams} credits
                                    </span>
                                </div>
                            </div>

                            {!sufficientCredits && selectedProductDetails && (
                                <div className="flex items-center gap-3 text-sm text-destructive bg-destructive/10 p-3 rounded-lg border border-destructive/20">
                                    <AlertCircle className="w-4 h-4 shrink-0" />
                                    <span>Insufficient credits.
                                        {/* Add top-up link if available, simplified for now */}
                                        <span className="font-semibold ml-1 cursor-pointer hover:underline">Top up now</span>
                                    </span>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                <DialogFooter className="p-6 bg-muted/10 border-t">
                    <Button variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
                    <Button
                        onClick={handleBoost}
                        disabled={loading || submitting || !sufficientCredits || !selectedProduct}
                        className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 transition-all"
                    >
                        {submitting ? (
                            <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Processing...
                            </>
                        ) : (
                            <>
                                Confirm Payment
                            </>
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
