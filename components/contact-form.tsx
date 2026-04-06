"use client";

import Link from "next/link";
import { useState } from "react";

export function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
    privacy_policy_accepted: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    if (!formData.privacy_policy_accepted) {
      setError("Моля, приемете Политиката за поверителност");
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          message: formData.message,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Грешка при изпращане на съобщението");
      }

      setSuccess(true);
      setFormData({
        name: "",
        email: "",
        phone: "",
        message: "",
        privacy_policy_accepted: false,
      });
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Грешка при изпращане на съобщението";
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="rounded-lg bg-white p-6 shadow dark:bg-gray-800">
      <h2 className="mb-6 text-2xl font-semibold text-gray-900 dark:text-white">
        Изпратете съобщение
      </h2>

      {success && (
        <div className="mb-4 rounded border border-green-400 bg-green-100 p-4 text-green-700 dark:bg-green-900 dark:text-green-300">
          Съобщението ви е изпратено успешно! Ще се свържем с вас скоро.
        </div>
      )}

      {error && (
        <div className="mb-4 rounded border border-red-400 bg-red-100 p-4 text-red-700 dark:bg-red-900 dark:text-red-300">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="name"
            className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Име *
          </label>
          <input
            type="text"
            id="name"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-brand-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          />
        </div>

        <div>
          <label
            htmlFor="email"
            className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Имейл *
          </label>
          <input
            type="email"
            id="email"
            required
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-brand-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          />
        </div>

        <div>
          <label
            htmlFor="phone"
            className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Телефон *
          </label>
          <input
            type="tel"
            id="phone"
            required
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-brand-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          />
        </div>

        <div>
          <label
            htmlFor="message"
            className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Съобщение *
          </label>
          <textarea
            id="message"
            required
            rows={5}
            value={formData.message}
            onChange={(e) =>
              setFormData({ ...formData, message: e.target.value })
            }
            className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-brand-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          />
        </div>

        <div className="pt-2">
          <label className="flex cursor-pointer items-start space-x-3">
            <input
              type="checkbox"
              required
              checked={formData.privacy_policy_accepted}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  privacy_policy_accepted: e.target.checked,
                })
              }
              className="mt-1 h-4 w-4 rounded border-gray-300 text-brand-600 focus:ring-brand-500"
            />
            <span className="text-sm text-gray-700 dark:text-gray-300">
              Съгласен съм с{" "}
              <Link
                href="/privacy-policy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-brand-600 underline hover:text-brand-800 dark:text-brand-400 dark:hover:text-brand-300"
              >
                Политиката за поверителност
              </Link>{" "}
              и се съгласявам обработката на моите лични данни. *
            </span>
          </label>
        </div>

        <button
          type="submit"
          disabled={isSubmitting || !formData.privacy_policy_accepted}
          className="w-full rounded-lg bg-brand-500 px-6 py-3 font-medium text-white transition-colors hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSubmitting ? "Изпращане..." : "Изпрати съобщение"}
        </button>
      </form>
    </div>
  );
}
