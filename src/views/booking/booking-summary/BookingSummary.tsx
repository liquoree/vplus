type BookingSummaryProps = {
    totalPrice: number;
    prepaymentPrice: number;
};

export function BookingSummary({ totalPrice, prepaymentPrice }: BookingSummaryProps) {
    return (
        <div className="booking-page__summary">
            <p className="booking-page__total">
                Итоговая стоимость: <b>{totalPrice.toLocaleString('ru-RU')}₽</b>
            </p>

            <p className="booking-page__prepayment">
                Предоплата: {prepaymentPrice.toLocaleString('ru-RU')}₽
            </p>
        </div>
    );
}
