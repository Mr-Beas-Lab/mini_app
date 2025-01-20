import { ChevronDown } from "lucide-react";
import { useState } from "react";

import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "./ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "./ui/popover";
import { Skeleton } from "./ui/skeleton";
import type { AssetInfo } from "@/hooks/useAssetQuery";
import { bigNumberToFloat, cn } from "@/libs/utils";
import { useTranslation } from "react-i18next";

type AssetSelectProps = {
  assets?: AssetInfo[];
  selectedAsset: AssetInfo | null;
  onAssetSelect?: (asset: AssetInfo | null) => void;
  className?: string;
  loading?: boolean;
};

export function AssetSelect({
  assets = [],
  selectedAsset,
  onAssetSelect,
  loading,
  className,
}: AssetSelectProps) {
  const [open, setOpen] = useState(false);
  const { t } = useTranslation();

  const handleAssetSelect = (assetAddress: string) => {
    const asset = assets.find(
      (asset) => asset.contractAddress === assetAddress,
    );

    if (asset && onAssetSelect) {
      onAssetSelect(asset);
    }

    setOpen(false);
  };

  const handleFilter = (_: string, search: string, keywords: string[] = []) => {
    const [symbol = ""] = keywords;

    return symbol.toLowerCase().includes(search.toLowerCase()) ? 1 : 0;
  };

  if (loading) {
    return <Skeleton className={cn("w-full h-10", className)} />;
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="default"
          aria-expanded={open}
          className={cn("w-full gap-1 !px-2", className)}
        >
          {selectedAsset ? (
            <>
              <Avatar className="size-[20px]">
                <AvatarImage
                  src={selectedAsset.meta?.imageUrl}
                  alt={
                    selectedAsset.meta?.displayName ??
                    selectedAsset.meta?.symbol
                  }
                />
              </Avatar>
              {selectedAsset.meta?.symbol}
            </>
          ) : (
            t("swap.form.selectAssetPlaceholder") // Use `t` to translate the placeholder
          )}
          <ChevronDown className="ml-auto h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0" avoidCollisions={false}>
        <Command filter={handleFilter}>
          <CommandInput placeholder={t("swap.form.searchPlaceholder")} /> {/* Translate placeholder */}
          <CommandList>
            <CommandEmpty>{t("swap.form.noAssetFound")}</CommandEmpty> {/* Translate message */}
            <CommandGroup>
              {assets.map((asset) => (
                <CommandItem
                  className="flex gap-2"
                  key={asset.contractAddress}
                  value={asset.contractAddress}
                  keywords={[asset?.meta?.symbol ?? ''].filter(Boolean)}
                  onSelect={handleAssetSelect}
                >
                  <Avatar className="w-6 h-6 aspect-square">
                    <AvatarImage
                      src={asset.meta?.imageUrl}
                      alt={asset.meta?.displayName ?? asset.meta?.symbol}
                    />
                    <AvatarFallback>
                      <Skeleton className="rounded-full" />
                    </AvatarFallback>
                  </Avatar>
                  {asset.meta?.symbol}

                  {asset.balance ? (
                    <pre className="ml-auto">
                      {bigNumberToFloat(
                        asset.balance,
                        asset.meta?.decimals ?? 9,
                      )}
                    </pre>
                  ) : null}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
