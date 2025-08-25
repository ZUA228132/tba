import { useToast } from './components.tsx';

export const useActionHandler = () => {
    const addToast = useToast();
    return (actionName: string) => {
        addToast(`'${actionName}' в разработке`);
    };
};
