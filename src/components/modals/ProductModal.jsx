import { useEffect, useMemo, useRef, useState } from "react";

import { useDispatch, useSelector } from "react-redux";

import { useFormik } from "formik";

import * as Yup from "yup";

import {
  FiX,
  FiUpload,
  FiPlus,
  FiAlertCircle,
  FiLoader,
} from "react-icons/fi";

import {
  createProduct,
  updateProduct,
  clearProductMutationError,
} from "../../store/slices/productsSlice";

const QUANTITY_TYPE_OPTIONS = [
  { value: "kg", label: "кг" },
  { value: "l", label: "л" },
  { value: "piece", label: "бр." },
];

const PRODUCT_TYPE_OPTIONS = [
  { value: "fruits", label: "Плод" },
  { value: "vegetables", label: "Зеленчук" },
  { value: "other", label: "Друго" },
];

const MAX_NAME_CHARS = 150;
const MAX_DESCRIPTION_CHARS = 5000;
const MAX_TYPE_CHARS = 100;
const MAX_IMAGES = 5;
const MAX_NUMBER_VAL = 10000000;

const EMPTY_FORM = {
  name: "",
  description: "",
  type: "",
  quantityType: "",
  quantity: "",
  price: "",
};

const normalizeProductType = (type) => {
  const normalized = String(type ?? "")
    .trim()
    .toLowerCase();

  const map = {
    плод: "fruits",
    fruits: "fruits",

    зеленчук: "vegetables",
    vegetables: "vegetables",

    друго: "other",
    other: "other",
  };

  return map[normalized] ?? "";
};

const inputCls =
  "w-full rounded-xl border border-[#102f20]/10 px-3.5 py-2.5 text-sm text-[#102f20] outline-none placeholder:text-[#102f20]/30 focus:border-[#1e4d2b] focus:ring-2 focus:ring-[#1e4d2b]/15";

const labelCls =
  "mb-1.5 block text-xs font-bold uppercase tracking-wide text-[#102f20]/45";

const errorInputCls =
  "border-red-300 focus:border-red-500 focus:ring-red-500/10";

const limitWords = (value, maxWords) => {
  if (!value.trim()) {
    return "";
  }

  const words = value.trim().split(/\s+/);

  if (words.length <= maxWords) {
    return value;
  }

  return words.slice(0, maxWords).join(" ");
};

const productValidationSchema = Yup.object({
  name: Yup.string()
    .trim()
    .required("Името е задължително.")
    .max(
      MAX_NAME_CHARS,
      `Името може да съдържа максимум ${MAX_NAME_CHARS} символа.`,
    ),

  description: Yup.string()
    .trim()
    .required("Описанието е задължително.")
    .max(
      MAX_DESCRIPTION_CHARS,
      `Описанието може да съдържа максимум ${MAX_DESCRIPTION_CHARS} символа.`,
    ),

  type: Yup.string()
    .oneOf(
      PRODUCT_TYPE_OPTIONS.map((option) => option.value),
      "Избери валиден тип.",
    )
    .required("Типът е задължителен."),

  quantityType: Yup.string()
    .oneOf(
      QUANTITY_TYPE_OPTIONS.map((option) => option.value),
      "Избери валидна мярка.",
    )
    .required("Мярката е задължителна."),

  quantity: Yup.number()
    .typeError("Количеството трябва да бъде число.")
    .required("Количеството е задължително.")
    .min(0, "Количеството не може да бъде отрицателно.")
    .max(
      MAX_NUMBER_VAL,
      `Количеството не може да надвишава ${MAX_NUMBER_VAL}.`,
    ),

  price: Yup.number()
    .typeError("Цената трябва да бъде число.")
    .required("Цената е задължителна.")
    .min(0, "Цената не може да бъде отрицателна.")
    .max(
      MAX_NUMBER_VAL,
      `Цената не може да надвишава ${MAX_NUMBER_VAL}.`,
    )
    .test(
      "is-decimal",
      "Цената може да има максимум два знака след запетаята.",
      (value) =>
        value === undefined ||
        /^\d+(\.\d{1,2})?$/.test(String(value)),
    ),
});

export default function ProductModal({
  open,
  onClose,
  onCreated,
  onUpdated,
  edit = false,
}) {
  const dispatch = useDispatch();

  const selected = useSelector(
    (state) => state.products.selected,
  );

  const mutationStatus = useSelector(
    (state) => state.products.mutationStatus,
  );

  const mutationError = useSelector(
    (state) => state.products.mutationError,
  );

  const loading = mutationStatus === "loading";

  const [featureDraft, setFeatureDraft] = useState("");
  const [features, setFeatures] = useState([]);

  // Старите снимки, които ще останат
  const [existingImages, setExistingImages] = useState([]);

  // Нови File обекти
  const [imageFiles, setImageFiles] = useState([]);

  // Local preview URL-и за новите файлове
  const [imagePreviews, setImagePreviews] = useState([]);

  const fileInputRef = useRef(null);

  const initialValues = useMemo(() => {
    if (!edit || !selected) {
      return EMPTY_FORM;
    }

    return {
      name: selected.name ?? "",

      description: selected.description ?? "",

      type: normalizeProductType(selected.type),

      quantityType: selected.quantityType ?? "",

      quantity:
        selected.quantity !== undefined &&
        selected.quantity !== null
          ? String(selected.quantity)
          : "",

      price:
        selected.price !== undefined &&
        selected.price !== null
          ? String(selected.price)
          : "",
    };
  }, [edit, selected]);

  const resetImagePreviews = () => {
    imagePreviews.forEach((url) => {
      URL.revokeObjectURL(url);
    });

    setImagePreviews([]);
  };

  const resetForm = () => {
    formik.resetForm({
      values: initialValues,
    });

    setFeatureDraft("");

    setFeatures(
      edit && selected
        ? [...(selected.features ?? [])]
        : [],
    );

    setExistingImages(
      edit && selected
        ? [...(selected.images ?? [])]
        : [],
    );

    setImageFiles([]);

    resetImagePreviews();
  };

  const formik = useFormik({
    initialValues,
    validationSchema: productValidationSchema,
    enableReinitialize: true,
    validateOnChange: true,
    validateOnBlur: true,

    onSubmit: async (values) => {
      const fields = {
        name: values.name.trim(),

        description: values.description.trim(),

        type: normalizeProductType(values.type),

        quantityType: values.quantityType,

        quantity: Number(values.quantity),

        price: Number(values.price),

        features,

        ...(edit
          ? {
              existingImages,
            }
          : {}),
      };

      // Debug само тук, където fields съществува
      console.log("========== PRODUCT SUBMIT ==========");
      console.log("EDIT:", edit);
      console.log("PRODUCT ID:", selected?._id);
      console.log("FIELDS:", fields);
      console.log("EXISTING IMAGES:", existingImages);
      console.log("IMAGE FILES:", imageFiles);
      console.log("IMAGE FILES COUNT:", imageFiles.length);

      imageFiles.forEach((file, index) => {
        console.log(`FILE ${index}:`, {
          name: file?.name,
          type: file?.type,
          size: file?.size,
          isFile:
            typeof File !== "undefined" &&
            file instanceof File,
        });
      });

      console.log("====================================");

      const result = edit
        ? await dispatch(
            updateProduct({
              id: selected?._id,
              fields,
              imageFiles,
            }),
          )
        : await dispatch(
            createProduct({
              fields,
              imageFiles,
            }),
          );

      if (edit) {
        if (updateProduct.fulfilled.match(result)) {
          resetForm();

          onUpdated?.(result.payload);

          onClose?.();
        }

        return;
      }

      if (createProduct.fulfilled.match(result)) {
        resetForm();

        onCreated?.(result.payload);

        onClose?.();
      }
    },
  });

  useEffect(() => {
    if (!open) {
      return;
    }

    dispatch(clearProductMutationError());

    imagePreviews.forEach((url) => {
      URL.revokeObjectURL(url);
    });

    setFeatureDraft("");

    setFeatures(
      edit && selected
        ? [...(selected.features ?? [])]
        : [],
    );

    setExistingImages(
      edit && selected
        ? [...(selected.images ?? [])]
        : [],
    );

    setImageFiles([]);

    setImagePreviews([]);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, edit, selected, dispatch]);

  if (!open) {
    return null;
  }

  const nameCharCount =
    formik.values.name.trim().length;

  const descriptionCharCount =
    formik.values.description.trim().length;

  const totalImageCount =
    existingImages.length + imageFiles.length;

  const handleClose = () => {
    dispatch(clearProductMutationError());

    imagePreviews.forEach((url) => {
      URL.revokeObjectURL(url);
    });

    setFeatureDraft("");

    setFeatures([]);

    setExistingImages([]);

    setImageFiles([]);

    setImagePreviews([]);

    formik.resetForm({
      values: initialValues,
    });

    onClose?.();
  };

  const addFeature = () => {
    const value = featureDraft.trim();

    if (!value) {
      return;
    }

    setFeatures((prev) => [
      ...prev,
      value,
    ]);

    setFeatureDraft("");
  };

  const removeFeature = (index) => {
    setFeatures((prev) =>
      prev.filter((_, i) => i !== index),
    );
  };

  const removeExistingImage = (index) => {
    setExistingImages((prev) =>
      prev.filter((_, i) => i !== index),
    );
  };

  const handleDescriptionChange = (e) => {
    const value = limitWords(
      e.target.value,
      MAX_DESCRIPTION_CHARS,
    );

    formik.setFieldValue(
      "description",
      value,
    );
  };

  const handleImagesSelected = (e) => {
    const files = Array.from(
      e.target.files ?? [],
    );

    if (files.length === 0) {
      return;
    }

    const remainingSlots =
      MAX_IMAGES - totalImageCount;

    if (remainingSlots <= 0) {
      e.target.value = "";
      return;
    }

    const filesToAdd = files
      .filter((file) =>
        file.type.startsWith("image/"),
      )
      .slice(0, remainingSlots);

    if (filesToAdd.length === 0) {
      e.target.value = "";
      return;
    }

    setImageFiles((prev) => [
      ...prev,
      ...filesToAdd,
    ]);

    setImagePreviews((prev) => [
      ...prev,
      ...filesToAdd.map((file) =>
        URL.createObjectURL(file),
      ),
    ]);

    e.target.value = "";
  };

  const removeNewImage = (index) => {
    setImageFiles((prev) =>
      prev.filter((_, i) => i !== index),
    );

    setImagePreviews((prev) => {
      if (prev[index]) {
        URL.revokeObjectURL(prev[index]);
      }

      return prev.filter((_, i) => i !== index);
    });
  };

  const fieldError = (fieldName) =>
    formik.touched[fieldName] &&
    formik.errors[fieldName];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 cursor-pointer bg-[#102f20]/30"
        onClick={handleClose}
      />

      <form
        onSubmit={formik.handleSubmit}
        noValidate
        className="relative z-10 flex max-h-[85vh] w-full max-w-lg flex-col overflow-hidden rounded-[24px] border border-[#102f20]/8 bg-white shadow-[0_20px_50px_rgba(15,46,31,0.18)]"
      >
        {/* HEADER */}
        <div className="flex items-center justify-between border-b border-[#102f20]/8 px-6 py-5">
          <div>
            <h3 className="text-lg font-black text-[#102f20]">
              {edit
                ? "Редактиране на продукт"
                : "Нов продукт"}
            </h3>

            <p className="mt-0.5 text-xs text-[#102f20]/45">
              {edit
                ? "Променете детайлите и запазете продукта."
                : "Попълнете детайлите за новия продукт."}
            </p>
          </div>

          <button
            type="button"
            onClick={handleClose}
            className="grid h-9 w-9 cursor-pointer place-items-center rounded-xl text-[#102f20]/40 hover:bg-[#eef4ec] hover:text-[#102f20]"
            aria-label="Затвори"
          >
            <FiX size={18} />
          </button>
        </div>

        {/* CONTENT */}
        <div className="flex-1 space-y-5 overflow-y-auto px-6 py-6">
          {mutationError && (
            <div className="flex items-start gap-2.5 rounded-xl bg-red-50 px-3.5 py-3 text-sm text-red-600">
              <FiAlertCircle
                size={16}
                className="mt-0.5 shrink-0"
              />

              <span>{mutationError}</span>
            </div>
          )}

          {/* NAME */}
          <div>
            <label className={labelCls}>
              Име
            </label>

            <input
              name="name"
              type="text"
              value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="напр. Ябълки Грени Смит"
              className={`${inputCls} ${
                fieldError("name")
                  ? errorInputCls
                  : ""
              }`}
            />

            <div className="mt-1.5 flex items-center justify-between">
              {fieldError("name") ? (
                <p className="text-xs font-semibold text-red-600">
                  {formik.errors.name}
                </p>
              ) : (
                <span />
              )}

              <span className="text-[10px] text-[#102f20]/30">
                Максимум {nameCharCount}/
                {MAX_NAME_CHARS} символа
              </span>
            </div>
          </div>

          {/* DESCRIPTION */}
          <div>
            <label className={`${labelCls} mb-0`}>
              Описание
            </label>

            <textarea
              name="description"
              rows={5}
              value={formik.values.description}
              onChange={handleDescriptionChange}
              onBlur={formik.handleBlur}
              placeholder="Кратко описание на продукта"
              className={`${inputCls} mt-1.5 resize-none ${
                fieldError("description")
                  ? errorInputCls
                  : ""
              }`}
            />

            <div className="mt-1.5 flex items-center justify-between">
              {fieldError("description") ? (
                <p className="text-xs font-semibold text-red-600">
                  {formik.errors.description}
                </p>
              ) : (
                <span />
              )}

              <span className="text-[10px] text-[#102f20]/30">
                Максимум {descriptionCharCount}/
                {MAX_DESCRIPTION_CHARS} символа
              </span>
            </div>
          </div>

          {/* TYPE + QUANTITY TYPE */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>
                Тип
              </label>

              <select
                name="type"
                value={formik.values.type}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={`${inputCls} cursor-pointer bg-white ${
                  fieldError("type")
                    ? errorInputCls
                    : ""
                }`}
              >
                <option value="" disabled>
                  Избери тип
                </option>

                {PRODUCT_TYPE_OPTIONS.map(
                  (option) => (
                    <option
                      key={option.value}
                      value={option.value}
                    >
                      {option.label}
                    </option>
                  ),
                )}
              </select>

              {fieldError("type") && (
                <p className="mt-1.5 text-xs font-semibold text-red-600">
                  {formik.errors.type}
                </p>
              )}
            </div>

            <div>
              <label className={labelCls}>
                Мярка
              </label>

              <select
                name="quantityType"
                value={formik.values.quantityType}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={`${inputCls} cursor-pointer bg-white ${
                  fieldError("quantityType")
                    ? errorInputCls
                    : ""
                }`}
              >
                <option value="" disabled>
                  Избери мярка
                </option>

                {QUANTITY_TYPE_OPTIONS.map(
                  (option) => (
                    <option
                      key={option.value}
                      value={option.value}
                    >
                      {option.label}
                    </option>
                  ),
                )}
              </select>

              {fieldError("quantityType") && (
                <p className="mt-1.5 text-xs font-semibold text-red-600">
                  {formik.errors.quantityType}
                </p>
              )}
            </div>
          </div>

          {/* QUANTITY + PRICE */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>
                Количество
              </label>

              <input
                name="quantity"
                type="number"
                min="0"
                value={formik.values.quantity}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={`${inputCls} ${
                  fieldError("quantity")
                    ? errorInputCls
                    : ""
                }`}
              />

              {fieldError("quantity") && (
                <p className="mt-1.5 text-xs font-semibold text-red-600">
                  {formik.errors.quantity}
                </p>
              )}
            </div>

            <div>
              <label className={labelCls}>
                Цена (лв.)
              </label>

              <input
                name="price"
                type="number"
                min="0"
                step="0.01"
                value={formik.values.price}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={`${inputCls} ${
                  fieldError("price")
                    ? errorInputCls
                    : ""
                }`}
              />

              {fieldError("price") && (
                <p className="mt-1.5 text-xs font-semibold text-red-600">
                  {formik.errors.price}
                </p>
              )}
            </div>
          </div>

          {/* FEATURES */}
          <div>
            <label className={labelCls}>
              Характеристики
            </label>

            <div className="flex gap-2">
              <input
                value={featureDraft}
                onChange={(e) =>
                  setFeatureDraft(e.target.value)
                }
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addFeature();
                  }
                }}
                placeholder="напр. Биоразградим"
                className={inputCls}
              />

              <button
                type="button"
                onClick={addFeature}
                className="grid h-[42px] w-[42px] shrink-0 cursor-pointer place-items-center rounded-xl bg-[#eef4ec] text-[#1e4d2b] hover:bg-[#e2ecdf]"
                aria-label="Добави характеристика"
              >
                <FiPlus size={16} />
              </button>
            </div>

            {features.length > 0 && (
              <div className="mt-2.5 flex flex-wrap gap-1.5">
                {features.map((feature, i) => (
                  <span
                    key={`${feature}-${i}`}
                    className="inline-flex items-center gap-1.5 rounded-full bg-[#eef4ec] px-2.5 py-1 text-[11px] font-bold text-[#1e4d2b]"
                  >
                    {feature}

                    <button
                      type="button"
                      onClick={() =>
                        removeFeature(i)
                      }
                      className="cursor-pointer text-[#1e4d2b]/60 hover:text-[#1e4d2b]"
                      aria-label={`Премахни ${feature}`}
                    >
                      <FiX size={11} />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* IMAGES */}
          <div>
            <div className="mb-1.5 flex items-center justify-between">
              <label
                className={`${labelCls} mb-0`}
              >
                Снимки
              </label>

              <span className="text-[11px] font-bold text-[#102f20]/40">
                {totalImageCount}/{MAX_IMAGES}
              </span>
            </div>

            <div className="flex flex-wrap gap-2.5">
              {/* EXISTING IMAGES */}
              {edit &&
                existingImages.map(
                  (src, i) => (
                    <div
                      key={`${src}-${i}`}
                      className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl border border-[#102f20]/10"
                    >
                      <img
                        src={src}
                        alt=""
                        className="h-full w-full object-cover"
                      />

                      <button
                        type="button"
                        onClick={() =>
                          removeExistingImage(i)
                        }
                        className="absolute right-0.5 top-0.5 grid h-5 w-5 cursor-pointer place-items-center rounded-full bg-[#102f20]/70 text-white"
                        aria-label="Премахни снимка"
                      >
                        <FiX size={9} />
                      </button>
                    </div>
                  ),
                )}

              {/* NEW IMAGE PREVIEWS */}
              {imagePreviews.map(
                (src, i) => (
                  <div
                    key={src}
                    className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl border border-[#102f20]/10"
                  >
                    <img
                      src={src}
                      alt=""
                      className="h-full w-full object-cover"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        removeNewImage(i)
                      }
                      className="absolute right-0.5 top-0.5 grid h-5 w-5 cursor-pointer place-items-center rounded-full bg-[#102f20]/70 text-white"
                      aria-label="Премахни снимка"
                    >
                      <FiX size={9} />
                    </button>
                  </div>
                ),
              )}

              {/* ADD IMAGE */}
              {totalImageCount < MAX_IMAGES && (
                <button
                  type="button"
                  onClick={() =>
                    fileInputRef.current?.click()
                  }
                  className="grid h-16 w-16 shrink-0 cursor-pointer place-items-center rounded-xl border border-dashed border-[#102f20]/20 text-[#102f20]/40 hover:border-[#1e4d2b] hover:text-[#1e4d2b]"
                  aria-label="Добави снимка"
                >
                  <FiUpload size={16} />
                </button>
              )}

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                hidden
                onChange={handleImagesSelected}
              />
            </div>

            <p className="mt-2 text-[10px] text-[#102f20]/35">
              Максимум {MAX_IMAGES} снимки.
            </p>
          </div>
        </div>

        {/* FOOTER */}
        <div className="flex justify-end gap-2.5 border-t border-[#102f20]/8 px-6 py-5">
          <button
            type="button"
            onClick={handleClose}
            className="cursor-pointer rounded-xl border border-[#102f20]/10 px-4 py-3 text-sm font-semibold text-[#102f20]/70 hover:bg-[#fafcf9]"
          >
            Отказ
          </button>

          <button
            type="submit"
            disabled={
              loading ||
              (edit && !selected?._id)
            }
            className="flex cursor-pointer items-center gap-2 rounded-xl bg-[#1e4d2b] px-4 py-3 text-sm font-semibold text-white shadow-[0_8px_20px_rgba(30,77,43,0.18)] hover:bg-[#173d22] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading && (
              <FiLoader
                size={16}
                className="animate-spin"
              />
            )}

            {loading
              ? "Запазване..."
              : edit
                ? "Запази промените"
                : "Запази продукта"}
          </button>
        </div>
      </form>
    </div>
  );
}