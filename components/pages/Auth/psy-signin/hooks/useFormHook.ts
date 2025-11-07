import { useForm } from "react-hook-form";
import { ZodType } from "zod";
import { zodResolver } from '@hookform/resolvers/zod';

export const useFormWithValidation = <T extends Record<string, any>>(
  validationSchema: ZodType<T>
) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<T>({
    resolver: zodResolver(validationSchema),
  });


  return { register, handleSubmit, errors, reset, isSubmitting };
};
