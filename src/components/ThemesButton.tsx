"use client";

import { useEffect, useState } from "react";

type iThemes = "" | "dark" | string;

function SetChangeThemes(themes: iThemes) {
  const parentHtml = document.querySelector("html");

  localStorage.setItem("themes", themes);

  if (themes === "dark") {
    parentHtml?.setAttribute("class", themes);
    return;
  }

  parentHtml?.removeAttribute("class");
  return;
}

export default function ThemesButton() {
  const [GetThemes, SetThemes] = useState<iThemes>("");

  useEffect(() => {
    const getThemesDefault = localStorage.getItem("themes");
    if (getThemesDefault) {
      SetThemes(getThemesDefault);
      SetChangeThemes(getThemesDefault);
    }
  }, []);

  useEffect(() => {
    SetChangeThemes(GetThemes);
  }, [GetThemes]);

  function ChangeThemes() {
    if (GetThemes === "dark") {
      SetThemes("");
      return;
    }
    SetThemes("dark");
  }

  return (
    <button type="button" onClick={() => ChangeThemes()} className="p-2 inline-flex justify-center items-center gap-x-2 rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-transparent dark:border-gray-700 dark:text-white dark:hover:bg-white/10 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600" aria-label="Toggle Themes">
      {GetThemes === "dark" ? (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="flex-shrink-0 w-4 h-4">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" />
        </svg>
      ) : (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="flex-shrink-0 w-4 h-4">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z" />
        </svg>
      )}

    </button>
  );
};
