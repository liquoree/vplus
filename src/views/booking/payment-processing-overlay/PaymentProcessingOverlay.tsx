import './PaymentProcessingOverlay.scss';

export function PaymentProcessingOverlay() {
    return (
        <div
            className="payment-processing-overlay"
            role="status"
            aria-live="polite"
            aria-label="Проверяем оплату"
        >
            <div className="payment-processing-overlay__card">
                <div className="payment-processing-overlay__loader">
                    <span />
                    <span />
                    <span />
                </div>

                <h2 className="payment-processing-overlay__title">
                    Проверяем оплату
                </h2>

                <p className="payment-processing-overlay__text">
                    Подождите несколько секунд, пока мы подтверждаем платёж
                </p>
            </div>
        </div>
    );
}