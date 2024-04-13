import { DOMAIN } from "@/configs/web-domain";
import { DESCRIPTION_OF_WEB, NAME_OF_WEB } from "@/configs/web-meta-data";
import { Metadata } from "next";

interface OptionsMetaData {
  titlePage?: string;
  description?: string;
  path?: string;
}

export function objectMetadata(options?: OptionsMetaData): Metadata {
  return {
    title: options?.titlePage ? `${options?.titlePage} | ${NAME_OF_WEB}` : NAME_OF_WEB,
    description: options?.description || DESCRIPTION_OF_WEB,
    metadataBase: new URL(DOMAIN),
    openGraph: {
      url: options?.path ?? "/",
      title: options?.titlePage ? `${options?.titlePage} | ${NAME_OF_WEB}` : NAME_OF_WEB,
      description: options?.description || DESCRIPTION_OF_WEB,
    }
  };
};
