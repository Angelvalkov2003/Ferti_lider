import { Metadata } from "next";
import Link from "next/link";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";

const siteName = process.env.SITE_NAME || "My Ecommerce Store";
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const metadata: Metadata = {
  title: `Политика за поверителност - ${siteName}`,
  description: `Политика за поверителност и защита на личните данни на ${siteName}`,
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Link
            href="/checkout"
            className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
          >
            <ArrowLeftIcon className="h-5 w-5 mr-2" />
            Назад към потвърждаване на покупката
          </Link>
        </div>
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8">
          Политика за поверителност и защита на личните данни
        </h1>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-8 space-y-8">
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              <strong>Последна актуализация:</strong> {new Date().toLocaleDateString("bg-BG", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
            <p className="text-gray-700 dark:text-gray-300 mb-6">
              Настоящата Политика за поверителност описва как {siteName} (наричан по-долу "ние", "нас", "наш") 
              събира, използва, съхранява и защитава личните данни на потребителите на нашия уебсайт{" "}
              <a href={siteUrl} className="text-blue-600 dark:text-blue-400 underline">{siteUrl}</a> 
              (наричан по-долу "Сайтът").
            </p>
            <p className="text-gray-700 dark:text-gray-300 mb-6">
              С използването на нашия Сайт, вие се съгласявате с условията на настоящата Политика за поверителност. 
              Ако не се съгласявате с някоя част от тази политика, моля, не използвайте нашия Сайт.
            </p>
          </div>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              1. Администратор на личните данни
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              Администратор на личните данни е {siteName}, регистриран и действащ съгласно законодателството на 
              Република България. За всякакви въпроси относно обработката на личните ви данни можете да се свържете 
              с нас на адрес, посочен в раздел "Контакти" на нашия Сайт.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              2. Какви лични данни събираме
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              При използването на нашия Сайт и при поръчване на продукти, ние можем да събираме и обработваме следните 
              категории лични данни:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300 ml-4">
              <li>
                <strong>Идентификационни данни:</strong> име, фамилия, имейл адрес, телефонен номер;
              </li>
              <li>
                <strong>Данни за доставка:</strong> адрес за доставка, данни за плащане (при плащане с карта);
              </li>
              <li>
                <strong>Технически данни:</strong> IP адрес, тип браузър, операционна система, данни за устройството, 
                което използвате за достъп до Сайта;
              </li>
              <li>
                <strong>Данни за използване:</strong> информация за това как използвате нашия Сайт, страници, които 
                посещавате, времето, прекарано на Сайта;
              </li>
              <li>
                <strong>Данни за поръчки:</strong> информация за поръчаните продукти, количество, цени, начин на плащане.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              3. Основания за обработка на личните данни
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              Ние обработваме вашите лични данни на следните правни основания съгласно Регламент (ЕС) 2016/679 
              (GDPR) и Закона за защита на личните данни (ЗЗЛД):
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300 ml-4">
              <li>
                <strong>Изпълнение на договор:</strong> обработката е необходима за изпълнение на договор за покупко-продажба 
                или за предприемане на стъпки преди сключването на договор по ваше искане;
              </li>
              <li>
                <strong>Съгласие:</strong> когато сте дали изрично съгласие за обработка на вашите лични данни за конкретни цели;
              </li>
              <li>
                <strong>Правни задължения:</strong> когато обработката е необходима за изпълнение на правно задължение, 
                което се прилага върху нас;
              </li>
              <li>
                <strong>Законни интереси:</strong> когато обработката е необходима за целите на законните ни интереси, 
                включително подобряване на услугите, предотвратяване на измами, сигурност на Сайта.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              4. Цели на обработката на личните данни
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              Ние използваме вашите лични данни за следните цели:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300 ml-4">
              <li>Обработка и изпълнение на вашите поръчки;</li>
              <li>Доставка на продуктите до посочения от вас адрес;</li>
              <li>Обработка на плащания и управление на финансови транзакции;</li>
              <li>Комуникация с вас относно поръчките, включително изпращане на потвърждения и уведомления;</li>
              <li>Предоставяне на клиентска поддръжка и отговор на вашите запитвания;</li>
              <li>Подобряване на функционалността и потребителското изживяване на нашия Сайт;</li>
              <li>Провеждане на анализи и статистики за използването на Сайта;</li>
              <li>Спазване на правни задължения, включително данъчно и счетоводно законодателство;</li>
              <li>Предотвратяване на измами и злоупотреби;</li>
              <li>Изпращане на маркетингови съобщения (само с вашето съгласие).</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              5. Съхранение на личните данни
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              Ние съхраняваме вашите лични данни само за периода, необходим за постигане на целите, за които са събрани, 
              или за периода, изискван от приложимото законодателство. Конкретните периоди на съхранение са:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300 ml-4">
              <li>
                <strong>Данни за поръчки:</strong> съхраняваме данните за поръчките за период от 5 години след изпълнение 
                на поръчката, в съответствие с изискванията на данъчното и счетоводното законодателство;
              </li>
              <li>
                <strong>Данни за маркетинг:</strong> ако сте дали съгласие за маркетингови съобщения, съхраняваме вашите 
                данни до оттегляне на съгласието;
              </li>
              <li>
                <strong>Технически данни:</strong> логовете и техническите данни се съхраняват за период до 12 месеца;
              </li>
              <li>
                <strong>Данни за контактна форма:</strong> съхраняваме данните от контактната форма за период до 2 години 
                след последния контакт.
              </li>
            </ul>
            <p className="text-gray-700 dark:text-gray-300 mt-4">
              След изтичане на периода на съхранение, личните данни се изтриват или анонимизират безопасно.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              6. Споделяне на личните данни с трети страни
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              Ние може да споделяме вашите лични данни със следните категории получатели:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300 ml-4">
              <li>
                <strong>Доставчици на услуги:</strong> използваме трети страни за предоставяне на услуги като обработка на 
                плащания (Stripe), изпращане на имейли (Resend), хостинг на Сайта (Vercel), управление на база данни (Supabase). 
                Тези доставчици имат достъп само до данните, необходими за изпълнение на техните функции, и са задължени да 
                ги защитават;
              </li>
              <li>
                <strong>Куриерски компании:</strong> споделяме данни за доставка с куриерски компании за изпълнение на доставките;
              </li>
              <li>
                <strong>Правни власти:</strong> можем да разкрием данни, ако това е изискано от закон или съдебно решение, 
                или за защита на нашите права и собственост;
              </li>
              <li>
                <strong>Бизнес партньори:</strong> само с вашето изрично съгласие можем да споделяме данни с доверени бизнес 
                партньори за маркетингови цели.
              </li>
            </ul>
            <p className="text-gray-700 dark:text-gray-300 mt-4">
              Ние не продаваме вашите лични данни на трети страни за маркетингови цели.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              7. Международни трансфери на данни
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              Някои от нашите доставчици на услуги могат да обработват данни извън Европейския съюз (ЕС) и Европейското 
              икономическо пространство (ЕИП). В такива случаи ние гарантираме, че са приложени подходящи гаранции за 
              защита на данните, включително:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300 ml-4">
              <li>Стандартни договорни клаузи, одобрени от Европейската комисия;</li>
              <li>Сертификация по Privacy Shield или еквивалентни механизми;</li>
              <li>Други правни механизми, осигуряващи адекватна защита на данните.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              8. Вашите права
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              Съгласно GDPR и ЗЗЛД, вие имате следните права относно вашите лични данни:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300 ml-4">
              <li>
                <strong>Право на достъп:</strong> имате право да получите информация дали обработваме ваши лични данни и 
                достъп до тези данни;
              </li>
              <li>
                <strong>Право на коригиране:</strong> имате право да поискате коригиране на неточни или непълни лични данни;
              </li>
              <li>
                <strong>Право на изтриване ("право да бъдеш забравен"):</strong> имате право да поискате изтриване на вашите 
                лични данни при определени обстоятелства;
              </li>
              <li>
                <strong>Право на ограничаване на обработката:</strong> имате право да поискате ограничаване на обработката 
                на вашите лични данни;
              </li>
              <li>
                <strong>Право на преносимост на данните:</strong> имате право да получите вашите лични данни в структуриран, 
                широко използван формат;
              </li>
              <li>
                <strong>Право на възражение:</strong> имате право да възразите срещу обработка на вашите лични данни за цели 
                на законни интереси или директна маркетинг;
              </li>
              <li>
                <strong>Право на оттегляне на съгласието:</strong> когато обработката се основава на съгласие, имате право 
                да го оттеглите по всяко време;
              </li>
              <li>
                <strong>Право на жалба:</strong> имате право да подадете жалба до надзорния орган (Комисията за защита на 
                личните данни в България) ако смятате, че обработката на вашите данни нарушава приложимото законодателство.
              </li>
            </ul>
            <p className="text-gray-700 dark:text-gray-300 mt-4">
              За упражняване на някое от тези права, моля, свържете се с нас на адреса, посочен в раздел "Контакти".
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              9. Бисквитки (Cookies)
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              Нашият Сайт използва бисквитки (cookies) за подобряване на потребителското изживяване. Бисквитките са малки 
              текстови файлове, които се съхраняват на вашето устройство. Използваме следните видове бисквитки:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300 ml-4">
              <li>
                <strong>Необходими бисквитки:</strong> тези бисквитки са от съществено значение за функционирането на Сайта, 
                включително съхраняване на съдържанието на количката;
              </li>
              <li>
                <strong>Функционални бисквитки:</strong> тези бисквитки позволяват на Сайта да запомня вашите избори и 
                предпочитания;
              </li>
              <li>
                <strong>Аналитични бисквитки:</strong> тези бисквитки ни помагат да разберем как посетителите използват Сайта.
              </li>
            </ul>
            <p className="text-gray-700 dark:text-gray-300 mt-4">
              Можете да контролирате и управлявате бисквитките чрез настройките на вашия браузър. Имайте предвид, че 
              деактивирането на някои бисквитки може да повлияе на функционалността на Сайта.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              10. Сигурност на данните
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              Ние прилагаме подходящи технически и организационни мерки за защита на вашите лични данни срещу 
              неоторизиран достъп, загуба, унищожаване или изменение. Тези мерки включват:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300 ml-4">
              <li>Шифроване на данните при предаване (SSL/TLS);</li>
              <li>Регулярни резервни копия на данните;</li>
              <li>Ограничен достъп до личните данни само за оторизиран персонал;</li>
              <li>Регулярни проверки на сигурността и актуализации на софтуера;</li>
              <li>Обучение на персонала за защита на данните.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              11. Данни на непълнолетни
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              Нашият Сайт не е предназначен за лица под 18 години. Ние не събираме умишлено лични данни от непълнолетни. 
              Ако установим, че сме събрали данни от непълнолетно лице без съгласието на родител или настойник, ще предприемем 
              стъпки за незабавно изтриване на тези данни.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              12. Промени в Политиката за поверителност
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              Ние запазваме правото да актуализираме тази Политика за поверителност от време на време. Всяка промяна ще бъде 
              публикувана на тази страница с актуализирана дата на "Последна актуализация". Препоръчваме ви редовно да проверявате 
              тази страница, за да сте информирани за всякакви промени.
            </p>
            <p className="text-gray-700 dark:text-gray-300">
              При значителни промени ще ви уведомим чрез имейл или чрез известие на Сайта.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              13. Контакти
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              За всякакви въпроси, заявки или оплаквания относно обработката на вашите лични данни или за упражняване на вашите 
              права, моля, свържете се с нас:
            </p>
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <p className="text-gray-700 dark:text-gray-300">
                <strong>{siteName}</strong>
              </p>
              <p className="text-gray-700 dark:text-gray-300">
                Уебсайт: <a href={siteUrl} className="text-blue-600 dark:text-blue-400 underline">{siteUrl}</a>
              </p>
              <p className="text-gray-700 dark:text-gray-300">
                За контакт използвайте формата за контакт на нашия Сайт.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              14. Надзорен орган
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              Ако смятате, че обработката на вашите лични данни нарушава приложимото законодателство, имате право да подадете 
              жалба до надзорния орган:
            </p>
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <p className="text-gray-700 dark:text-gray-300">
                <strong>Комисия за защита на личните данни</strong>
              </p>
              <p className="text-gray-700 dark:text-gray-300">
                Адрес: София 1592, бул. "Проф. Цветан Лазаров" № 2
              </p>
              <p className="text-gray-700 dark:text-gray-300">
                Телефон: 02/91-53-518
              </p>
              <p className="text-gray-700 dark:text-gray-300">
                Имейл: kzld@cpdp.bg
              </p>
              <p className="text-gray-700 dark:text-gray-300">
                Уебсайт: <a href="https://www.cpdp.bg" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 underline">www.cpdp.bg</a>
              </p>
            </div>
          </section>

          <div className="pt-8 border-t border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Тази Политика за поверителност е съставена в съответствие с Регламент (ЕС) 2016/679 (GDPR), 
              Закона за защита на личните данни на Република България и други приложими разпоредби.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
