"use client";

import { useState, useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    Search,
    Plus,
    Edit2,
    Trash2,
    Package,
    AlertCircle,
    X,
    Upload,
    ImageIcon,
    Loader2,
} from "lucide-react";
import Image from "next/image";
import { useToast } from "@/hooks/use-toast";
import { siteConfig } from "@/template/config";

interface CatalogRecord {
    _id?: string;
    id: number;
    name: string;
    category: string;
    price: number;
    image: string;
    [key: string]: any; // Dynamic fields from metadataSchema
}

export function FleetManager() {
    const { toast } = useToast();
    const [items, setItems] = useState<CatalogRecord[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<CatalogRecord | null>(null);

    // Image upload state
    const [uploadedImageUrl, setUploadedImageUrl] = useState<string>("");
    const [isUploading, setIsUploading] = useState(false);
    const [useUrlInput, setUseUrlInput] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const { taxonomy, ui, metadataSchema } = siteConfig;

    const fetchItems = async () => {
        try {
            setIsLoading(true);
            const response = await fetch("/api/cars");
            if (!response.ok) throw new Error("Failed to fetch items");
            const data = await response.json();
            setItems(data.cars || []);
        } catch (error) {
            toast({
                title: "Error",
                description: `Failed to load ${taxonomy.itemLabelPlural.toLowerCase()}`,
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchItems();
    }, []);

    const handleDelete = async (id: string) => {
        if (!confirm(`Are you sure you want to remove this ${taxonomy.itemLabelSingular.toLowerCase()}?`)) return;

        try {
            const token = localStorage.getItem("auth_token");
            const response = await fetch(`/api/cars/${id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
            });

            if (!response.ok) throw new Error("Delete failed");

            toast({
                title: `${taxonomy.itemLabelSingular} Removed`,
                description: `The ${taxonomy.itemLabelSingular.toLowerCase()} has been removed successfully.`,
            });
            fetchItems();
        } catch (error) {
            toast({
                title: "Error",
                description: `Failed to delete ${taxonomy.itemLabelSingular.toLowerCase()}`,
                variant: "destructive",
            });
        }
    };

    const handleImageUpload = async (file: File) => {
        setIsUploading(true);
        try {
            const token = localStorage.getItem("auth_token");
            const formData = new FormData();
            formData.append("file", file);

            const response = await fetch("/api/upload", {
                method: "POST",
                headers: { Authorization: `Bearer ${token}` },
                body: formData,
            });

            if (!response.ok) {
                const err = await response.json();
                throw new Error(err.error || "Upload failed");
            }

            const data = await response.json();
            setUploadedImageUrl(data.url);
            toast({ title: "Image Uploaded", description: "Image uploaded successfully." });
        } catch (error: any) {
            toast({
                title: "Upload Failed",
                description: error.message || "Failed to upload image",
                variant: "destructive",
            });
        } finally {
            setIsUploading(false);
        }
    };

    const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const raw = Object.fromEntries(formData.entries());

        // Use uploaded image URL if available, else use manual URL
        const imageUrl = uploadedImageUrl || (raw.image as string) || "";

        const payload: any = {
            name: raw.name,
            category: raw.category,
            price: Number(raw.price),
            image: imageUrl,
            id: editingItem ? editingItem.id : Date.now(),
        };

        // Add dynamic metadata fields
        for (const spec of metadataSchema) {
            if (raw[spec.key]) {
                payload[spec.key] = raw[spec.key];
            }
        }

        try {
            const token = localStorage.getItem("auth_token");
            const url = editingItem ? `/api/cars/${editingItem._id}` : "/api/cars";
            const method = editingItem ? "PATCH" : "POST";

            const response = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) throw new Error("Save failed");

            toast({
                title: editingItem ? `${taxonomy.itemLabelSingular} Updated` : `${taxonomy.itemLabelSingular} Added`,
                description: "The catalog has been updated successfully.",
            });
            setIsModalOpen(false);
            setEditingItem(null);
            setUploadedImageUrl("");
            setUseUrlInput(false);
            fetchItems();
        } catch (error) {
            toast({
                title: "Error",
                description: `Failed to save ${taxonomy.itemLabelSingular.toLowerCase()}`,
                variant: "destructive",
            });
        }
    };

    const openModal = (item: CatalogRecord | null) => {
        setEditingItem(item);
        setUploadedImageUrl(item?.image || "");
        setUseUrlInput(false);
        setIsModalOpen(true);
    };

    const filteredItems = items.filter(
        (item) =>
            item.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.category?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Get the first 4 metadata specs for the card display
    const cardSpecs = metadataSchema.slice(0, 4);

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Action Bar */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder={`Search ${taxonomy.itemLabelPlural.toLowerCase()} by name or category...`}
                        className="w-full pl-10 pr-4 py-2.5 bg-input border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all shadow-sm"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <Button
                    onClick={() => openModal(null)}
                    className="w-full md:w-auto gap-2 bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20"
                >
                    <Plus className="w-4 h-4" /> Add {taxonomy.itemLabelSingular}
                </Button>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {isLoading ? (
                    Array.from({ length: 3 }).map((_, i) => (
                        <Card key={i} className="h-64 animate-pulse bg-muted/50 border-border" />
                    ))
                ) : filteredItems.length > 0 ? (
                    filteredItems.map((item) => (
                        <Card
                            key={item._id}
                            className="group overflow-hidden bg-card border-border hover:shadow-2xl transition-all duration-300 border-2 hover:border-primary/20"
                        >
                            <div className="relative h-40 bg-muted overflow-hidden">
                                <Image
                                    src={item.image || "/placeholder.jpg"}
                                    alt={item.name}
                                    fill
                                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4 justify-end gap-2">
                                    <Button
                                        onClick={() => openModal(item)}
                                        size="sm"
                                        variant="secondary"
                                        className="h-8 w-8 p-0 rounded-full"
                                    >
                                        <Edit2 className="w-3.5 h-3.5" />
                                    </Button>
                                    <Button
                                        onClick={() => handleDelete(item._id!)}
                                        size="sm"
                                        variant="destructive"
                                        className="h-8 w-8 p-0 rounded-full"
                                    >
                                        <Trash2 className="w-3.5 h-3.5" />
                                    </Button>
                                </div>
                                <div className="absolute top-3 left-3 px-2 py-1 bg-primary/90 text-primary-foreground text-[10px] font-bold uppercase rounded">
                                    {item.category}
                                </div>
                            </div>
                            <div className="p-5 space-y-3">
                                <div className="flex justify-between items-start">
                                    <h3 className="font-bold text-foreground text-lg group-hover:text-primary transition-colors line-clamp-1">
                                        {item.name}
                                    </h3>
                                    <span className="text-primary font-bold whitespace-nowrap">
                                        {ui.currencySymbol}{item.price}{taxonomy.priceSuffix}
                                    </span>
                                </div>
                                <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                                    {cardSpecs.map((spec) => (
                                        <div key={spec.key} className="flex items-center gap-1.5 font-medium">
                                            <AlertCircle className="w-3 h-3" />
                                            <span className="truncate">{item[spec.key] || "—"}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </Card>
                    ))
                ) : (
                    <div className="col-span-full py-20 text-center border-2 border-dashed border-border rounded-2xl">
                        <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-20" />
                        <p className="text-lg font-bold">No {taxonomy.itemLabelPlural.toLowerCase()} found</p>
                        <p className="text-muted-foreground">
                            Start building your catalog by adding a {taxonomy.itemLabelSingular.toLowerCase()}.
                        </p>
                    </div>
                )}
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-200">
                    <Card className="w-full max-w-2xl bg-card border-border shadow-2xl relative overflow-hidden flex flex-col max-h-[90vh]">
                        <div className="p-6 border-b border-border flex justify-between items-center bg-secondary/30">
                            <div>
                                <h2 className="text-2xl font-black tracking-tight">
                                    {editingItem ? `Edit ${taxonomy.itemLabelSingular}` : `Add New ${taxonomy.itemLabelSingular}`}
                                </h2>
                                <p className="text-sm text-muted-foreground">
                                    Fill in the details for your catalog
                                </p>
                            </div>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => { setIsModalOpen(false); setUploadedImageUrl(""); setUseUrlInput(false); }}
                                className="rounded-full"
                            >
                                <X className="w-5 h-5" />
                            </Button>
                        </div>

                        <form onSubmit={handleSave} className="p-6 overflow-y-auto space-y-6">
                            {/* Universal fields */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                                        {taxonomy.itemLabelSingular} Name
                                    </label>
                                    <input
                                        name="name"
                                        defaultValue={editingItem?.name}
                                        required
                                        className="w-full px-4 py-2 bg-input border border-border rounded-lg"
                                        placeholder={`e.g. Premium ${taxonomy.itemLabelSingular}`}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                                        {taxonomy.categoryLabel}
                                    </label>
                                    <input
                                        name="category"
                                        defaultValue={editingItem?.category}
                                        required
                                        className="w-full px-4 py-2 bg-input border border-border rounded-lg"
                                        placeholder="e.g. Premium, Standard, Budget"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                                        Price ({ui.currencySymbol}){taxonomy.priceSuffix && ` ${taxonomy.priceSuffix}`}
                                    </label>
                                    <input
                                        name="price"
                                        type="number"
                                        defaultValue={editingItem?.price}
                                        required
                                        className="w-full px-4 py-2 bg-input border border-border rounded-lg"
                                    />
                                </div>
                            </div>

                            {/* Image Upload */}
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <label className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                                        Image
                                    </label>
                                    <button
                                        type="button"
                                        className="text-xs text-primary hover:underline"
                                        onClick={() => setUseUrlInput(!useUrlInput)}
                                    >
                                        {useUrlInput ? "Switch to Upload" : "Use URL instead"}
                                    </button>
                                </div>

                                {useUrlInput ? (
                                    <input
                                        name="image"
                                        defaultValue={editingItem?.image}
                                        className="w-full px-4 py-2 bg-input border border-border rounded-lg"
                                        placeholder="https://... or /uploads/my-image.jpg"
                                        onChange={(e) => setUploadedImageUrl(e.target.value)}
                                    />
                                ) : (
                                    <div
                                        className={`relative border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all hover:border-primary/50 hover:bg-primary/5 ${
                                            isUploading ? "border-primary/50 bg-primary/5" : "border-border"
                                        }`}
                                        onClick={() => fileInputRef.current?.click()}
                                        onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
                                        onDrop={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            const file = e.dataTransfer.files?.[0];
                                            if (file) handleImageUpload(file);
                                        }}
                                    >
                                        <input
                                            ref={fileInputRef}
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={(e) => {
                                                const file = e.target.files?.[0];
                                                if (file) handleImageUpload(file);
                                            }}
                                        />
                                        {isUploading ? (
                                            <div className="flex flex-col items-center gap-2 py-4">
                                                <Loader2 className="w-8 h-8 text-primary animate-spin" />
                                                <p className="text-sm text-muted-foreground">Uploading...</p>
                                            </div>
                                        ) : uploadedImageUrl ? (
                                            <div className="flex flex-col items-center gap-3">
                                                <div className="relative w-32 h-24 rounded-lg overflow-hidden border border-border">
                                                    <Image
                                                        src={uploadedImageUrl}
                                                        alt="Preview"
                                                        fill
                                                        className="object-cover"
                                                    />
                                                </div>
                                                <p className="text-xs text-muted-foreground">
                                                    Click or drop to replace
                                                </p>
                                            </div>
                                        ) : (
                                            <div className="flex flex-col items-center gap-2 py-4">
                                                <div className="p-3 bg-secondary rounded-full">
                                                    <ImageIcon className="w-6 h-6 text-muted-foreground" />
                                                </div>
                                                <p className="text-sm font-medium text-foreground">
                                                    Click to upload or drag & drop
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    JPEG, PNG, WebP, GIF, SVG — max 5 MB
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Dynamic Metadata Fields */}
                            {metadataSchema.length > 0 && (
                                <div className="space-y-4">
                                    <p className="text-sm font-bold uppercase tracking-wider text-muted-foreground border-b border-border pb-2">
                                        {taxonomy.itemLabelSingular} Details
                                    </p>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {metadataSchema.map((spec) => (
                                            <div key={spec.key} className="space-y-2">
                                                <label className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                                                    {spec.label}
                                                </label>
                                                <input
                                                    name={spec.key}
                                                    defaultValue={editingItem?.[spec.key] || ""}
                                                    className="w-full px-4 py-2 bg-input border border-border rounded-lg"
                                                    placeholder={`Enter ${spec.label.toLowerCase()}`}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="pt-4 flex gap-3">
                                <Button
                                    type="submit"
                                    className="flex-1 bg-primary text-primary-foreground py-6 font-bold text-lg"
                                >
                                    {editingItem ? `Update ${taxonomy.itemLabelSingular}` : `Add to Catalog`}
                                </Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => { setIsModalOpen(false); setUploadedImageUrl(""); setUseUrlInput(false); }}
                                    className="px-8 border-border"
                                >
                                    Cancel
                                </Button>
                            </div>
                        </form>
                    </Card>
                </div>
            )}
        </div>
    );
}
