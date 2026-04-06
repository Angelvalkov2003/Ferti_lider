import { ContactForm } from "components/contact-form";
import { ContactInfoCards } from "components/contact-info-cards";
import Footer from "components/layout/footer";
import { GoogleMapEmbed } from "components/google-map-embed";
import { getFacebookUrl } from "lib/site-contact";

export default function ContactPage() {
  const facebookUrl = getFacebookUrl();

  return (
    <>
      <div className="bg-gray-50 px-4 py-12 dark:bg-gray-900 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <h1 className="mb-8 text-center text-4xl font-bold text-gray-900 dark:text-white">
            Свържете се с нас
          </h1>

          <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
            <div className="space-y-8">
              <div>
                <h2 className="mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
                  Контактна информация
                </h2>
                <ContactInfoCards />
              </div>

              <div>
                <h2 className="mb-3 text-lg font-semibold text-gray-900 dark:text-white">
                  Локация
                </h2>
                <GoogleMapEmbed />
              </div>

              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Facebook
                </h2>
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-brand-500 dark:bg-brand-600">
                      <svg
                        className="h-6 w-6 text-white"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <path
                          fillRule="evenodd"
                          d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Страница във Facebook
                    </h3>
                    <a
                      href={facebookUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="break-all text-base text-gray-900 hover:text-brand-600 dark:text-white dark:hover:text-brand-400"
                    >
                      {facebookUrl.replace(/^https?:\/\/(www\.)?/, "")}
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <ContactForm />
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
