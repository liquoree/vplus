import { PaymentReturn } from '@/views/payment-return/PaymentReturn';

interface PaymentReturnPageProps {
    searchParams: Promise<{
        paymentId?: string;
    }>;
}

export default async function PaymentReturnPage({
                                                    searchParams,
                                                }: PaymentReturnPageProps) {
    const {
        paymentId,
    } = await searchParams;

    if (!paymentId) {
        // обработать некорректный возврат
        return null;
    }

    return (
        <PaymentReturn
            paymentId={paymentId}
        />
    );
}