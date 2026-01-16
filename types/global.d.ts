interface Window {
  snap: {
    pay: (
      paymentToken: string,
      options: {
        onSuccess: (result: unknown) => void;
        onPending: (result: unknown) => void;
        onError: (result: unknown) => void;
        onClose: () => void;
      }
    ) => void;
  };
}
