"use client";

import { useCallback, useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";

import {
  SubscriptionPlan,
  getAdminSubscriptionPlans,
  createSubscriptionPlan,
  updateSubscriptionPlan,
  deleteSubscriptionPlan,
} from "@/entities/subscription";
import { GenerateCopyButton } from "@/features/admin-courses";
import { useGeneratePlan } from "@/shared/hooks/use-generate-plan";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { toast } from "sonner";
import { Loader2, Plus, Sparkles } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/shared/ui/dialog";

export default function AdminSubscriptionPlansPage() {
  const t = useTranslations("adminSubscriptions");
  const locale = useLocale();
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [formLoading, setFormLoading] = useState(false);
  const [editingPlan, setEditingPlan] = useState<SubscriptionPlan | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [aiPrompt, setAiPrompt] = useState("");

  const { mutate: runGeneratePlan, isPending: isGeneratingPlan } =
    useGeneratePlan();

  const [deleteId, setDeleteId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    slug: "",
    titleRu: "",
    titleKz: "",
    description: "",
    durationMonths: 1,
    priceKzt: 0,
    isActive: true,
  });

  const handleAiAutoFill = () => {
    runGeneratePlan(
      {
        durationMonths: formData.durationMonths || 1,
        priceKzt: formData.priceKzt || 0,
        hint: aiPrompt.trim() || undefined,
        locale: locale === "kz" ? "kz" : "ru",
      },
      {
        onSuccess: (data) => {
          setFormData((prev) => ({
            ...prev,
            slug: data.slug,
            titleRu: data.titleRu,
            titleKz: data.titleKz,
            description: data.description,
          }));
          toast.success(t("plans.aiGenerateSuccess"));
        },
        onError: () => {
          toast.error(t("plans.aiGenerateFailed"));
        },
      },
    );
  };

  const loadPlans = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getAdminSubscriptionPlans();
      setPlans(data);
    } catch {
      toast.error(t("plans.loadError"));
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    // We intentionally ignore the rule here since it's initial load
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadPlans();
  }, [loadPlans]);

  const handleCreate = () => {
    setEditingPlan(null);
    setFormData({
      slug: "",
      titleRu: "",
      titleKz: "",
      description: "",
      durationMonths: 1,
      priceKzt: 0,
      isActive: true,
    });
    setIsModalOpen(true);
  };

  const handleEdit = (plan: SubscriptionPlan) => {
    setEditingPlan(plan);
    setFormData({
      slug: plan.slug,
      titleRu: plan.titleRu,
      titleKz: plan.titleKz || "",
      description:
        (plan as SubscriptionPlan & { description?: string }).description || "",
      durationMonths: plan.durationMonths,
      priceKzt: plan.priceKzt,
      isActive:
        (plan as SubscriptionPlan & { isActive?: boolean }).isActive ?? true,
    });
    setIsModalOpen(true);
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteSubscriptionPlan(deleteId);
      toast.success(t("plans.planDeleted"));
      loadPlans();
    } catch {
      toast.error(t("plans.deleteError"));
    } finally {
      setDeleteId(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    try {
      if (editingPlan) {
        await updateSubscriptionPlan({ id: editingPlan.id, ...formData });
        toast.success(t("plans.planUpdated"));
      } else {
        await createSubscriptionPlan(formData);
        toast.success(t("plans.planCreated"));
      }
      setIsModalOpen(false);
      loadPlans();
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      toast.error(e.response?.data?.message || t("plans.saveError"));
    } finally {
      setFormLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8 flex justify-center">
        <Loader2 className="animate-spin w-8 h-8" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 p-6 max-w-2xl mx-auto">
      <Card className="rounded-2xl border-none shadow-sm">
        <CardHeader className="pb-4 flex flex-row items-center justify-between">
          <CardTitle className="text-xl font-bold">
            {t("plans.title")}
          </CardTitle>
          {plans.length < 3 && (
            <Button variant="outline" size="sm" onClick={handleCreate}>
              <Plus className="w-4 h-4 mr-1" />
              {t("plans.createPlan")}
            </Button>
          )}
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-3">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className="p-4 border rounded-xl flex flex-wrap gap-4 justify-between items-center bg-white"
              >
                <div className="flex flex-col min-w-0 flex-1">
                  <span className="font-semibold text-base text-gray-900 break-words">
                    {plan.titleRu} ({plan.slug})
                  </span>
                  <span className="text-[13px] text-gray-400 mt-0.5">
                    {plan.durationMonths} мес. - {plan.priceKzt} KZT
                  </span>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Button
                    variant="outline"
                    className="text-gray-700 bg-gray-50/50 hover:bg-gray-100"
                    onClick={() => handleEdit(plan)}
                  >
                    {t("plans.edit")}
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => setDeleteId(plan.id)}
                  >
                    {t("plans.delete")}
                  </Button>
                </div>
              </div>
            ))}
            {plans.length === 0 && (
              <p className="text-gray-500">{t("plans.noPlans")}</p>
            )}
            {plans.length >= 3 && (
              <p className="text-sm text-amber-500 mt-2">
                {t("plans.limitReached")}
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingPlan ? t("plans.editPlan") : t("plans.createPlan")}
            </DialogTitle>
          </DialogHeader>
          <form
            id="plan-form"
            onSubmit={handleSubmit}
            className="flex flex-col gap-4 py-4"
          >
            {/* AI Assistant Quick Auto-Fill */}
            <div className="rounded-xl border border-primary/20 bg-primary/5 p-3 space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-primary">
                <Sparkles className="size-3.5" />
                <span>{t("plans.aiAssistantTitle")}</span>
              </div>
              <div className="flex gap-2">
                <Input
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  placeholder={t("plans.aiAssistantPrompt")}
                  className="h-8 text-xs bg-background"
                  disabled={isGeneratingPlan}
                />
                <Button
                  type="button"
                  size="sm"
                  variant="default"
                  onClick={handleAiAutoFill}
                  disabled={isGeneratingPlan}
                  className="h-8 shrink-0 gap-1.5 text-xs"
                >
                  {isGeneratingPlan ? (
                    <Loader2 className="size-3.5 animate-spin" />
                  ) : (
                    <Sparkles className="size-3.5" />
                  )}
                  {t("plans.aiFillAction")}
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-sm text-muted-foreground">
                  {t("plans.slug")}
                </label>
                <Input
                  required
                  value={formData.slug}
                  onChange={(e) =>
                    setFormData({ ...formData, slug: e.target.value })
                  }
                  placeholder="e.g. 1-month"
                />
              </div>
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm text-muted-foreground">
                    {t("plans.titleRu")}
                  </label>
                  <GenerateCopyButton
                    entity="plan"
                    field="title"
                    title={formData.titleRu}
                    description={formData.description}
                    targetLocale="ru"
                    parent={{
                      durationMonths: formData.durationMonths,
                      priceKzt: formData.priceKzt,
                    }}
                    onGenerated={(text) =>
                      setFormData((prev) => ({ ...prev, titleRu: text }))
                    }
                  />
                </div>
                <Input
                  required
                  value={formData.titleRu}
                  onChange={(e) =>
                    setFormData({ ...formData, titleRu: e.target.value })
                  }
                  placeholder="e.g. 1 месяц"
                />
              </div>
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm text-muted-foreground">
                    {t("plans.titleKz")}
                  </label>
                  <GenerateCopyButton
                    entity="plan"
                    field="title"
                    title={formData.titleKz || formData.titleRu}
                    description={formData.description}
                    targetLocale="kz"
                    parent={{
                      durationMonths: formData.durationMonths,
                      priceKzt: formData.priceKzt,
                    }}
                    onGenerated={(text) =>
                      setFormData((prev) => ({ ...prev, titleKz: text }))
                    }
                  />
                </div>
                <Input
                  value={formData.titleKz}
                  onChange={(e) =>
                    setFormData({ ...formData, titleKz: e.target.value })
                  }
                  placeholder="e.g. 1 ай"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm text-muted-foreground">
                  {t("plans.durationMonths")}
                </label>
                <Input
                  type="number"
                  required
                  min={1}
                  value={formData.durationMonths}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      durationMonths: parseInt(e.target.value) || 1,
                    })
                  }
                />
              </div>
              <div className="flex flex-col gap-2 col-span-2">
                <label className="text-sm text-muted-foreground">
                  {t("plans.priceKzt")}
                </label>
                <Input
                  type="number"
                  required
                  min={0}
                  value={formData.priceKzt}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      priceKzt: parseInt(e.target.value) || 0,
                    })
                  }
                />
              </div>
              <div className="col-span-2 flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm text-muted-foreground">
                    {t("plans.description")}
                  </label>
                  <GenerateCopyButton
                    entity="plan"
                    field="description"
                    title={formData.titleRu || formData.titleKz}
                    description={formData.description}
                    parent={{
                      durationMonths: formData.durationMonths,
                      priceKzt: formData.priceKzt,
                    }}
                    onGenerated={(text) =>
                      setFormData((prev) => ({ ...prev, description: text }))
                    }
                  />
                </div>
                <Input
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                />
              </div>
            </div>
          </form>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              {t("cancel")}
            </Button>
            <Button type="submit" form="plan-form" disabled={formLoading}>
              {formLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {editingPlan ? t("plans.update") : t("plans.create")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("plans.deleteConfirm")}</DialogTitle>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteId(null)}>
              {t("cancel")}
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              {t("plans.delete")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
