import './TemplateInfoPage.scss';

export function TemplateInfoPage({
    title,
    description,
    children,
}: {
    title: string;
    description: string;
    children: React.ReactNode;
}) {
    return (
        <div className="template-info-page">
            <div className="template-info-page__inner">
                <h1 className="template-info-page__title">{title}</h1>
                <p className="template-info-page__description">{description}</p>
                <div className="template-info-page__content">{children}</div>
            </div>
        </div>
    );
}
