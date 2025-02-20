import { IReportNewUserDTO } from "@/repositories/dtos/CompanyDTO";
import { Stripe, loadStripe } from "@stripe/stripe-js";
import stripe from "libs/stripe";
import { useCallback, useEffect, useState } from "react";

const maxAllowedFreeUsersGoldPlan = import.meta.env
  .VITE_FREE_EMPLOYEES_LIMIT_GOLD_PLAN;
const maxAllowedFreeUsersSilverPlan = import.meta.env
  .VITE_FREE_EMPLOYEES_LIMIT_SILVER_PLAN;
const maxAllowedFreeUsersBronzePlan = import.meta.env
  .VITE_FREE_EMPLOYEES_LIMIT_BRONZE_PLAN;

export const useStripe = () => {
  const [, setStripe] = useState<Stripe | null>(null);
  const loadStripeAsync = useCallback(async () => {
    const stripeInstance = await loadStripe(
      process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY!
    );
    setStripe(stripeInstance);
  }, []);

  useEffect(() => {
    loadStripeAsync();
  }, [loadStripeAsync]);

  async function listSubscriptions() {
    try {
      const subscriptions = await stripe.subscriptions.list();
      return subscriptions;
    } catch (error) {
      console.log("Error at trying to list subscriptions: ", error);
    }
  }

  async function getCustomer(companyEmail: string) {
    try {
      const costumers = await stripe.customers.list();
      const costumer = costumers.data.find(
        (costumer) => costumer.email === companyEmail
      );
      if (costumer) {
        return costumer;
      }
      return null;
    } catch (error) {
      console.log("Error at trying to get customer: ", error);
    }
  }

  const reportNewAdditionalUser = async (data: IReportNewUserDTO) => {
    const { totalCompanyUsers, companyPlan, subscriptionId, companyEmail } =
      data;
    if (
      (companyPlan === "bronze" &&
        totalCompanyUsers > maxAllowedFreeUsersBronzePlan) ||
      (companyPlan === "silver" &&
        totalCompanyUsers > maxAllowedFreeUsersSilverPlan) ||
      (companyPlan === "gold" &&
        totalCompanyUsers > maxAllowedFreeUsersGoldPlan)
    ) {
      try {
        const customer = await getCustomer(companyEmail);
        if (subscriptionId && customer) {
          await stripe.billing.meterEvents
            .create({
              event_name: "additional_user",
              payload: {
                value: "1",
                stripe_customer_id: customer.id,
              },
            })
            .then((res) =>
              console.log("Usage record created successfully: ", res)
            );
        }
      } catch (error) {
        console.log("Error at trying to get customer: ", error);
      }
    }
  };

  return {
    listSubscriptions,
    getCustomer,
    reportNewAdditionalUser,
  };
};
