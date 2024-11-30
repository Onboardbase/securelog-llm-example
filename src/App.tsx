import React, { useState, useEffect } from "react";
import axios from "axios";

const SecureForm = () => {
  const [inputValue, setInputValue] = useState("");
  const [removeSecrets, setRemoveSecrets] = useState(false);
  const [maskOnPaste, setMaskOnPaste] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      /**
       * this is assuming you have pulled the lastest backend updates and
       * its running on port 3000
       *
       * you can point this to https://api.securelog.com/mask-secret once the update is merged to live
       */

      const { data } = await axios.post(
        "https://api.securelog.com/mask-secret",
        {
          text: inputValue + (e?.clipboardData?.getData("text") || ""),
          maskedValue: removeSecrets ? "" : "*",
          visibleChars: removeSecrets ? 0 : 5,
        }
      );

      setInputValue(data?.rawValue);

      if (data.secrets.length) {
        /**
         * user can choose to reject submission here once secret has been detected in text
         */

        let warningMessage = `Warning: A new secret has been detected in text\n\n`;
        data.secrets
          .filter((data: any) => data !== null)
          .map(
            (secret: { detectorType: string; rawValue: string }) =>
              (warningMessage += `Detector Type: ${secret.detectorType}\nRaw Value: ${secret.rawValue}`)
          );

        setMessage(warningMessage);
      }
    } catch (error) {
      setMessage("Error processing submission");
      console.error("Submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (inputValue.trim() === "") {
      setMessage("");
    }
  }, [inputValue]);

  return (
    <div className="w-full">
      <form
        onSubmit={handleSubmit}
        className="bg-white/5 border-gray-500/10 border rounded-lg flex flex-row overflow-hidden items-start"
      >
        <textarea
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onPaste={handleSubmit}
          placeholder="Enter your text here..."
          rows={3}
          className="bg-transparent text-white placeholder:text-gray-500 resize-none focus:outline-non focus:border-none focus:ring-0 border-none break-words break-all ring-0 text-xs outline-none py-2.5 selection:text-gray-500 px-3 font-mono w-full transition-all duration-300"
        />

        <button
          type="submit"
          disabled={isSubmitting}
          className="text-white rounded-md hover:bg-white/5 m-1 focus:bg-white/10 w-8 h-8 aspect-square flex items-center justify-center ring-0 outline-0"
          style={{
            cursor: isSubmitting ? "not-allowed" : "pointer",
          }}
        >
          {isSubmitting ? (
            <svg
              width="16"
              height="16"
              className="animate-spin text-[#F5BE58]"
              fill="currentColor"
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M12 6V3"></path>
              <path d="m16.25 7.752 2.15-2.15"></path>
              <path d="M18 12h3"></path>
              <path d="m16.25 16.25 2.15 2.15"></path>
              <path d="M12 18v3"></path>
              <path d="M7.75 16.25 5.6 18.4"></path>
              <path d="M6 12H3"></path>
              <path d="M7.75 7.752 5.6 5.602"></path>
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              className="-ml-px"
            >
              <polyline points="9 10 4 15 9 20"></polyline>
              <path d="M20 4v7a4 4 0 0 1-4 4H4"></path>
            </svg>
          )}
        </button>
      </form>

      <div className="mt-3 space-y-1">
        <div className="flex gap-3 items-center">
          <div className="flex h-6 shrink-0 items-center">
            <div className="group grid size-4 grid-cols-1">
              <input
                id="comments"
                onChange={() => setMaskOnPaste(!maskOnPaste)}
                aria-describedby="comments-description"
                name="comments"
                type="checkbox"
                checked={maskOnPaste}
                className="col-start-1 row-start-1 appearance-none rounded border border-gray-300 bg-white checked:border-[#F5BE58] checked:bg-[#F5BE58] indeterminate:border-[#F5BE58] indeterminate:bg-[#F5BE58] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F5BE58] disabled:border-gray-300 disabled:bg-gray-100 disabled:checked:bg-gray-100 forced-colors:appearance-auto"
              />
              <svg
                className="pointer-events-none col-start-1 row-start-1 size-3.5 self-center justify-self-center stroke-white group-has-[:disabled]:stroke-gray-950/25"
                viewBox="0 0 14 14"
                fill="none"
              >
                <path
                  className="opacity-0 group-has-[:checked]:opacity-100"
                  d="M3 8L6 11L11 3.5"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  className="opacity-0 group-has-[:indeterminate]:opacity-100"
                  d="M3 7H11"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </div>
          </div>
          <div className="text-sm">
            <label className="font-medium text-white">
              Mask/remove on paste
            </label>
          </div>
        </div>
        <div className="flex gap-3 items-center">
          <div className="flex h-6 shrink-0 items-center">
            <div className="group grid size-4 grid-cols-1">
              <input
                onChange={() => setRemoveSecrets(!removeSecrets)}
                id="comments"
                aria-describedby="comments-description"
                name="comments"
                type="checkbox"
                checked={removeSecrets}
                className="col-start-1 row-start-1 appearance-none rounded border border-gray-300 bg-white checked:border-[#F5BE58] checked:bg-[#F5BE58] indeterminate:border-[#F5BE58] indeterminate:bg-[#F5BE58] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F5BE58] disabled:border-gray-300 disabled:bg-gray-100 disabled:checked:bg-gray-100 forced-colors:appearance-auto"
              />
              <svg
                className="pointer-events-none col-start-1 row-start-1 size-3.5 self-center justify-self-center stroke-white group-has-[:disabled]:stroke-gray-950/25"
                viewBox="0 0 14 14"
                fill="none"
              >
                <path
                  className="opacity-0 group-has-[:checked]:opacity-100"
                  d="M3 8L6 11L11 3.5"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  className="opacity-0 group-has-[:indeterminate]:opacity-100"
                  d="M3 7H11"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </div>
          </div>
          <div className="text-sm">
            <label className="font-medium text-white">
              Remove secret not mask it
            </label>
          </div>
        </div>
      </div>

      {message && (
        <div className="p-3 rounded-lg bg-[#F5BE58]/10 text-[#F5BE58] whitespace-pre-wrap mt-3">
          <p className="text-sm text-grey-400 mb-6 font-medium">{message}</p>
        </div>
      )}
    </div>
  );
};

const App = () => (
  <div className="relative flex flex-col p-8 sm:p-20">
    <h1 className="text-3xl font-semibold mb-6">✨ Securelog LLM Form Test</h1>
    <p className="text-sm text-gray-400 mb-6">
      This shows how secrets can be removed or masked when entered in an input
      field.
    </p>
    <SecureForm />
    <div className="text-gray-400 mt-10 space-y-3 w-full">
      <a
        className="flex items-center gap-2 hover:underline text-sm"
        href="https://securelog.com"
        target="_blank"
        rel="noopener noreferrer"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          className="size-4"
        >
          <path d="M16.555 5.412a8.028 8.028 0 0 0-3.503-2.81 14.899 14.899 0 0 1 1.663 4.472 8.547 8.547 0 0 0 1.84-1.662ZM13.326 7.825a13.43 13.43 0 0 0-2.413-5.773 8.087 8.087 0 0 0-1.826 0 13.43 13.43 0 0 0-2.413 5.773A8.473 8.473 0 0 0 10 8.5c1.18 0 2.304-.24 3.326-.675ZM6.514 9.376A9.98 9.98 0 0 0 10 10c1.226 0 2.4-.22 3.486-.624a13.54 13.54 0 0 1-.351 3.759A13.54 13.54 0 0 1 10 13.5c-1.079 0-2.128-.127-3.134-.366a13.538 13.538 0 0 1-.352-3.758ZM5.285 7.074a14.9 14.9 0 0 1 1.663-4.471 8.028 8.028 0 0 0-3.503 2.81c.529.638 1.149 1.199 1.84 1.66ZM17.334 6.798a7.973 7.973 0 0 1 .614 4.115 13.47 13.47 0 0 1-3.178 1.72 15.093 15.093 0 0 0 .174-3.939 10.043 10.043 0 0 0 2.39-1.896ZM2.666 6.798a10.042 10.042 0 0 0 2.39 1.896 15.196 15.196 0 0 0 .174 3.94 13.472 13.472 0 0 1-3.178-1.72 7.973 7.973 0 0 1 .615-4.115ZM10 15c.898 0 1.778-.079 2.633-.23a13.473 13.473 0 0 1-1.72 3.178 8.099 8.099 0 0 1-1.826 0 13.47 13.47 0 0 1-1.72-3.178c.855.151 1.735.23 2.633.23ZM14.357 14.357a14.912 14.912 0 0 1-1.305 3.04 8.027 8.027 0 0 0 4.345-4.345c-.953.542-1.971.981-3.04 1.305ZM6.948 17.397a8.027 8.027 0 0 1-4.345-4.345c.953.542 1.971.981 3.04 1.305a14.912 14.912 0 0 0 1.305 3.04Z" />
        </svg>
        Go to securelog.com →
      </a>
      <a
        className="flex items-center gap-2 hover:underline text-sm"
        href="https://github.com/Onboardbase/securelog-llm-example"
        target="_blank"
        rel="noopener noreferrer"
      >
        <svg
          aria-label="github"
          viewBox="0 0 14 14"
          className="h-3.5 w-3.5"
          fill="currentColor"
        >
          <path
            d="M7 .175c-3.872 0-7 3.128-7 7 0 3.084 2.013 5.71 4.79 6.65.35.066.482-.153.482-.328v-1.181c-1.947.415-2.363-.941-2.363-.941-.328-.81-.787-1.028-.787-1.028-.634-.438.044-.416.044-.416.7.044 1.071.722 1.071.722.635 1.072 1.641.766 2.035.59.066-.459.24-.765.437-.94-1.553-.175-3.193-.787-3.193-3.456 0-.766.262-1.378.721-1.881-.065-.175-.306-.897.066-1.86 0 0 .59-.197 1.925.722a6.754 6.754 0 0 1 1.75-.24c.59 0 1.203.087 1.75.24 1.335-.897 1.925-.722 1.925-.722.372.963.131 1.685.066 1.86.46.48.722 1.115.722 1.88 0 2.691-1.641 3.282-3.194 3.457.24.219.481.634.481 1.29v1.926c0 .197.131.415.481.328C11.988 12.884 14 10.259 14 7.175c0-3.872-3.128-7-7-7z"
            fill="currentColor"
            fill-rule="evenodd"
          ></path>
        </svg>
        View on github →
      </a>
      <a
        className="flex items-center gap-2 hover:underline text-sm"
        href="https://join.slack.com/t/onboardbase-community/shared_invite/zt-1hqckrw8l-~RjaGExoczIk7e0X_4ZiWw"
        target="_blank"
        rel="noopener noreferrer"
      >
        <svg
          enable-background="new 0 0 2447.6 2452.5"
          viewBox="0 0 2447.6 2452.5"
          fill="currentColor"
          xmlns="http://www.w3.org/2000/svg"
          className="h-3.5 w-3.5"
        >
          <g clip-rule="evenodd" fill-rule="evenodd">
            <path
              d="m897.4 0c-135.3.1-244.8 109.9-244.7 245.2-.1 135.3 109.5 245.1 244.8 245.2h244.8v-245.1c.1-135.3-109.5-245.1-244.9-245.3.1 0 .1 0 0 0m0 654h-652.6c-135.3.1-244.9 109.9-244.8 245.2-.2 135.3 109.4 245.1 244.7 245.3h652.7c135.3-.1 244.9-109.9 244.8-245.2.1-135.4-109.5-245.2-244.8-245.3z"
              class="astro-3SDC4Q5U"
            ></path>
            <path
              d="m2447.6 899.2c.1-135.3-109.5-245.1-244.8-245.2-135.3.1-244.9 109.9-244.8 245.2v245.3h244.8c135.3-.1 244.9-109.9 244.8-245.3zm-652.7 0v-654c.1-135.2-109.4-245-244.7-245.2-135.3.1-244.9 109.9-244.8 245.2v654c-.2 135.3 109.4 245.1 244.7 245.3 135.3-.1 244.9-109.9 244.8-245.3z"
              class="astro-3SDC4Q5U"
            ></path>
            <path
              d="m1550.1 2452.5c135.3-.1 244.9-109.9 244.8-245.2.1-135.3-109.5-245.1-244.8-245.2h-244.8v245.2c-.1 135.2 109.5 245 244.8 245.2zm0-654.1h652.7c135.3-.1 244.9-109.9 244.8-245.2.2-135.3-109.4-245.1-244.7-245.3h-652.7c-135.3.1-244.9 109.9-244.8 245.2-.1 135.4 109.4 245.2 244.7 245.3z"
              class="astro-3SDC4Q5U"
            ></path>
            <path
              d="m0 1553.2c-.1 135.3 109.5 245.1 244.8 245.2 135.3-.1 244.9-109.9 244.8-245.2v-245.2h-244.8c-135.3.1-244.9 109.9-244.8 245.2zm652.7 0v654c-.2 135.3 109.4 245.1 244.7 245.3 135.3-.1 244.9-109.9 244.8-245.2v-653.9c.2-135.3-109.4-245.1-244.7-245.3-135.4 0-244.9 109.8-244.8 245.1 0 0 0 .1 0 0"
              class="astro-3SDC4Q5U"
            ></path>
          </g>
        </svg>
        Join us on slack →
      </a>
    </div>
  </div>
);

export default App;
