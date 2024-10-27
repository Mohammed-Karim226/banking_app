"use client";

import { useCallback, useEffect, useState } from "react";

import { PlaidLinkProps } from "@/src/types";
import { PlaidLinkOptions, usePlaidLink } from "react-plaid-link";
import { useRouter } from "next/navigation";
import {
  createLinkToken,
  exchangePublicToken,
} from "@/src/utils/actions/user.actions";
import Image from "next/image";
import { AddSquare } from "iconsax-react";
import { cn } from "@/lib/utils";
import { Button } from "../../ui/button";

const PlaidLink = ({ user, variant, isOpen }: PlaidLinkProps) => {
  const [token, setToken] = useState("");

  const router = useRouter();

  useEffect(() => {
    const getLinkToken = async () => {
      const data = await createLinkToken(user);
      setToken(data?.linkToken ?? "");
    };
    getLinkToken();
  }, [user]);

  const onSuccess = useCallback(
    async (public_token: string) => {
      await exchangePublicToken({ publicToken: public_token, user });
      router.push("/");
    },
    [user, router]
  );

  const config: PlaidLinkOptions = {
    token,
    onSuccess,
  };

  const { open, ready } = usePlaidLink(config);
  return (
    <>
      {variant === "primary" ? (
        <Button
          onClick={() => open()}
          disabled={!ready}
          className="plaidlink-primary"
        >
          Connect Bank
        </Button>
      ) : variant === "ghost" ? (
        <Button
          onClick={() => open()}
          variant="ghost"
          className="flex gap-1 justify-center items-center"
        >
          <AddSquare
            size="20"
            color="#475467"
            className="dark:text-slate-400"
          />{" "}
          <h2 className="text-16 dark:text-slate-400 text-gray-600 font-semibold">
            Add Bank
          </h2>
        </Button>
      ) : (
        <Button onClick={() => open()} className="plaidlink-default">
          <Image
            src={"/icons/connect-bank.svg"}
            alt="connect bank"
            width={24}
            height={24}
          />
          <p
            className={cn(
              "text-base dark:text-slate-700 font-semibold text-black-2",
              {
                hidden: !isOpen,
              }
            )}
          >
            Connect Bank
          </p>
        </Button>
      )}
    </>
  );
};

export default PlaidLink;
