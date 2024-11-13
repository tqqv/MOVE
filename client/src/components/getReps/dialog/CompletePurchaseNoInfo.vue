<script setup>
  import { ref, onMounted, watch } from 'vue';
  import Dialog from 'primevue/dialog';

  import Divider from 'primevue/divider';
  import CheckMarkCustom from '@/components/CheckMarkCustom.vue';
  import FormCardPayment from '@/components/FormCardPayment.vue';
  import { usePopupStore, useGetRepsStore, useUserStore } from '@/stores';
  import { useCardStore } from '@/stores/card.store';
import { checkout, createCardInfo, getClientSecret } from '@/services/payment';

  const props = defineProps({
    title: String,
  });
  const popupStore = usePopupStore();
  const getRepsStore = useGetRepsStore();
  const cardStore = useCardStore();
  const userStore = useUserStore();

  const cardForm = ref(null);

  const isCheckMark = ref(false);

  const setupIntentClientSecret = async () => {
    const res = await getClientSecret()
    if(res) {
      // console.log(res);
      return res.data.data
    } else {
      console.error("Get Client Secret failed");
      return;
    }
  }

  const handleSaveCard = async() => {
    if (!cardForm.value || !cardForm.value.stripe) {
      console.error("cardForm or Stripe is undefined");
      return;
    }

    const { cardNumber, cardName, stripe, country } = cardForm.value;

    const clientSecret = await setupIntentClientSecret();
    // console.log(clientSecret);

    try {
      const confirm = await stripe.confirmCardSetup(clientSecret, {
        payment_method: {
          card: cardNumber,
          billing_details: { name: cardName },
        },
      });

      if (confirm) {
        const data = {
          cardName,
          paymentMethodId: confirm.setupIntent.payment_method,
          country: country.name,
        };

        const res = await createCardInfo(data);

        if (res && res.status === 200) {
          cardStore.fetchCard()
          console.log('Card saved successfully.');
        } else {
          console.log('Insert failed');
        }
      } else {
        console.error("Error: Confirmation failed");
      }
    } catch (error) {
      console.error("Error:", error.message);
    }
  }

  const handleUseCardOneTime = async() => {
    if (!cardForm.value || !cardForm.value.stripe) {
      console.error("cardForm or Stripe is undefined");
      return;
    }

    const { cardNumber, cardName, stripe, country } = cardForm.value;

    try {
      const paymentMethod = await stripe.createPaymentMethod({
        type: 'card',
        card: cardNumber, // cardNumber ở đây phải là một đối tượng Stripe Card từ frontend, không phải chuỗi số thẻ trực tiếp
        billing_details: { name: cardName },
      });

      console.log("Check payment ne: ", paymentMethod);


      return paymentMethod.paymentMethod.id
    } catch (error) {
      console.error("Error:", error.message);
    }
  }

  const handleCheckout = async (paymentMethodId) => {
    const dataCheckout = {
      paymentMethodId: paymentMethodId,
      repPackageId: getRepsStore.selectedOption.id,
    }
    const res = await checkout(dataCheckout)
    if (res && res.status === 200) {
      userStore.user.REPs += getRepsStore.selectedOption.rep;
    } else if(res.status === 201) {
      // toast.info('Payment has been initiated, please wait.')
      console.log('Payment has been initiated, please wait.');
    } else {
      // toast.error("Payment failed!")
      console.log('Payment failed!');
    }
  }

  const toggleLoadPayment = async() => {
    if(isCheckMark.value){
      await handleSaveCard();
      await handleCheckout(cardStore.card.paymentMethodId);
    } else {
      const paymentMethodId = await handleUseCardOneTime();
      await handleCheckout(paymentMethodId);
    }

    popupStore.showLoadingPayment = !popupStore.showLoadingPayment;
    popupStore.showOpenBuyREPs = false;
  };
  const toggleBuyREPs = () => {
    popupStore.showOpenBuyREPs = !popupStore.showOpenBuyREPs;

    getRepsStore.clearSelectedOption();
  };

</script>

<template>
  <div class="card flex justify-center">
    <Dialog
      :visible="popupStore.showOpenBuyREPs"
      :modal="true"
      :draggable="false"
      :header="props.title"
      @show="lockScroll"
      @hide="unlockScroll"
      @update:visible="toggleBuyREPs"
      :style="{ width: '40rem' }"
      dismissableMask="true"
    >
      <div class="space-y-4">
        <div class="text-base text-[#666666] font-bold">Order Summary</div>
        <div class="flex justify-between">
          <div class="font-bold text-base">{{ getRepsStore.selectedOption.rep }} REP$</div>
          <div class="text-base">US${{ getRepsStore.selectedOption.amount }}</div>
        </div>
      </div>
      <div class="text-sm text-[#777777]">One-time charge on 20 Jul 2020.</div>
      <Divider />
      <div class="flex gap-x-6 justify-end">
        <div>Total</div>
        <div class="text-base font-bold">US${{ getRepsStore.selectedOption.amount }}</div>
      </div>

      <div class="space-y-4">
        <div class="text-base text-[#666666] font-bold">Payment Details</div>

        <FormCardPayment ref="cardForm" />
        <div class="text-xs">
          <span class="text-[#777777]">
            By submitting payment information you acknowledge that you have read, understood and
            agree to be bound by MOVE’s
          </span>
          <span class="text-primary"> End User License Agreement, Privacy Policy</span>
          <span class="text-[#777777]"> and</span>
          <span class="text-primary"> Refund Policy</span>.
        </div>
        <CheckMarkCustom
          label="Save my payment details for faster checkout in the future."
          :checked="isCheckMark"
          groupName="checkMark"
          @update:modelValue="(value) => (isCheckMark = value)"

        />
        <div class="flex justify-center mt-4">
          <button @click="toggleLoadPayment" class="btn w-1/3">Submit</button>
        </div>
      </div>
    </Dialog>
  </div>
</template>
