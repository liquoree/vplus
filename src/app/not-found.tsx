import { ErrorPage } from '@/views/error/ErrorPage';

export default function NotFound() {
    return (
        <ErrorPage
            code="404"
            title="Страница не найдена"
            description={'Возможно, страница была удалена, перемещена или адрес указан неверно.'}
        />
    );
}
