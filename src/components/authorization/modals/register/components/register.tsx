// import { zodResolver } from '@hookform/resolvers/zod';
// import { useRef, useState } from 'react';
// import { Controller, useForm } from 'react-hook-form';
// import { Link, useNavigate } from 'react-router-dom';
// import { useRegister } from '@/react-query/mutation';

// import { userAtom } from '@/store/auth';
// import { useAtom } from 'jotai';
// import {
//     RegisterFormDefaultValues,
//     type BackendErrorResponse,
//     type RegisterFormValues,
// } from '@/components/authorization/modals/register/components/index.types';
// import { SignUpFormSchema } from '@/components/authorization/modals/register/components/schema';

// export const Register = () => {
//     const avatarRef = useRef<HTMLInputElement>(null);
//     const [showPassword, setShowPassword] = useState<boolean>(false);
//     const [showConfirmPassword, setShowConfirmPassword] =
//         useState<boolean>(false);
//     const [, setUser] = useAtom(userAtom);
//     const navigate = useNavigate();

//     const { control, trigger, setError, clearErrors, handleSubmit, watch } =
//         useForm<RegisterFormValues>({
//             resolver: zodResolver(SignUpFormSchema),
//             defaultValues: RegisterFormDefaultValues,
//             mode: 'onBlur',
//         });

//     const usernameValue = watch('username');
//     const firstLetter = usernameValue ? usernameValue[0].toUpperCase() : null;

//     const { mutate: handleRegister } = useRegister({
//         onError: (error) => {
//             const data = error.response?.data as
//                 BackendErrorResponse | undefined;
//             if (data?.errors) {
//                 const backendErrors = data.errors;

//                 Object.entries(backendErrors).forEach(([field, messages]) => {
//                     setError(field as keyof RegisterFormValues, {
//                         type: 'server',
//                         message: messages[0],
//                     });
//                 });
//             }
//         },
//         onSuccess: (data) => {
//             navigate('/');
//             setUser({
//                 email: data.user.email,
//                 token: data.token,
//                 username: data.user.username,
//             });
//             localStorage.setItem('email', data.user.email);
//             localStorage.setItem('token', data.token);
//             localStorage.setItem('username', data.user.username);
//         },
//     });

//     const onSubmit = (registerPayload: RegisterFormValues) => {
//         handleRegister(registerPayload);
//     };

//     return (
//         <div className="flex flex-col gap-[46px]">
//             <h1 className="font-poppins h-[63px] text-[42px] leading-[100%] font-semibold text-gray-900">
//                 Registration
//             </h1>
//             <form
//                 className="max-h-[518px] max-w-[554px]"
//                 onSubmit={handleSubmit(onSubmit)}
//             >
//                 <div className="flex flex-col gap-6">
//                     <Controller
//                         name="avatar"
//                         control={control}
//                         render={({
//                             field: { onChange, value },
//                             fieldState: { error },
//                         }) => {
//                             const handleClick = () => {
//                                 avatarRef.current?.click();
//                             };

//                             const handleRemove = () => {
//                                 onChange(null);
//                                 if (avatarRef.current) {
//                                     avatarRef.current.value = '';
//                                 }
//                             };

//                             const handleFileChange = async (
//                                 e: React.ChangeEvent<HTMLInputElement>,
//                             ) => {
//                                 const file = e.target.files?.[0];

//                                 if (file) {
//                                     if (file.size > 1 * 1024 * 1024) {
//                                         setError('avatar', {
//                                             type: 'manual',
//                                             message:
//                                                 'File size must be less than 1MB',
//                                         });
//                                         if (avatarRef.current)
//                                             avatarRef.current.value = '';
//                                         return;
//                                     }
//                                     clearErrors('avatar');
//                                     onChange(file);
//                                 }
//                             };

//                             const previewUrl = value
//                                 ? URL.createObjectURL(value)
//                                 : null;

//                             return (
//                                 <>
//                                     <input
//                                         type="file"
//                                         accept="image/*"
//                                         ref={avatarRef}
//                                         style={{ display: 'none' }}
//                                         onChange={handleFileChange}
//                                     />
//                                     <div
//                                         className="mb-5 flex h-[100px] w-[215px] cursor-pointer flex-row items-center gap-4"
//                                         onClick={handleClick}
//                                         role="button"
//                                         aria-label="Upload avatar"
//                                     >
//                                         {previewUrl ? (
//                                             <img
//                                                 src={previewUrl}
//                                                 alt="Chosen avatar"
//                                                 className="h-[100px] w-[100px] rounded-full"
//                                             />
//                                         ) : firstLetter ? (
//                                             <div className="flex h-[100px] w-[100px] items-center justify-center rounded-full bg-gray-400 text-3xl font-semibold text-white">
//                                                 {firstLetter}{' '}
//                                             </div>
//                                         ) : (
//                                             <UploadPhotoIcon />
//                                         )}

//                                         <div className="font-poppins text-sm leading-[100%] font-normal whitespace-nowrap">
//                                             {previewUrl ? (
//                                                 <div className="flex gap-3">
//                                                     <span
//                                                         onClick={(e) => {
//                                                             e.stopPropagation();
//                                                             handleClick();
//                                                         }}
//                                                     >
//                                                         Upload new
//                                                     </span>
//                                                     <span
//                                                         onClick={(e) => {
//                                                             e.stopPropagation();
//                                                             handleRemove();
//                                                         }}
//                                                     >
//                                                         Remove
//                                                     </span>
//                                                 </div>
//                                             ) : (
//                                                 'Upload image'
//                                             )}
//                                         </div>
//                                     </div>
//                                     {error && (
//                                         <span className="text-red-400">
//                                             {error.message}
//                                         </span>
//                                     )}
//                                 </>
//                             );
//                         }}
//                     />
//                     <Controller
//                         name="username"
//                         control={control}
//                         render={({
//                             field: { onChange, value },
//                             fieldState: { error },
//                         }) => {
//                             const hasError = !!error;
//                             return (
//                                 <div className="relative">
//                                     <input
//                                         onBlur={() => {
//                                             trigger('username');
//                                         }}
//                                         onChange={onChange}
//                                         value={value}
//                                         className={`input-default ${hasError ? 'border-orange-600' : ''}`}
//                                         placeholder="Username"
//                                     />
//                                     <InputAsterisk
//                                         visible={!value}
//                                         className="top-2 left-[89px]"
//                                     />
//                                     <div className="mt-3">
//                                         {error?.message ? (
//                                             <span className="text-orange-600">
//                                                 {error.message}
//                                             </span>
//                                         ) : null}
//                                     </div>
//                                 </div>
//                             );
//                         }}
//                     />

//                     <Controller
//                         name="email"
//                         control={control}
//                         render={({
//                             field: { onChange, value },
//                             fieldState: { error },
//                         }) => {
//                             const hasError = !!error;
//                             return (
//                                 <div className="relative">
//                                     <input
//                                         onChange={onChange}
//                                         value={value}
//                                         className={`input-default ${hasError ? 'border-orange-600' : ''}`}
//                                         placeholder="E-mail"
//                                     />
//                                     <InputAsterisk
//                                         visible={!value}
//                                         className="top-2 left-16"
//                                     />
//                                     <div className="mt-3">
//                                         {error?.message ? (
//                                             <span className="text-orange-600">
//                                                 {error.message}
//                                             </span>
//                                         ) : null}
//                                     </div>
//                                 </div>
//                             );
//                         }}
//                     />

//                     <Controller
//                         name="password"
//                         control={control}
//                         render={({
//                             field: { onChange, value },
//                             fieldState: { error },
//                         }) => {
//                             const hasError = !!error;
//                             return (
//                                 <>
//                                     <div className="relative">
//                                         <input
//                                             value={value}
//                                             onChange={onChange}
//                                             className={`input-default ${hasError ? 'border-orange-600' : ''}`}
//                                             placeholder="Password"
//                                             type={
//                                                 showPassword
//                                                     ? 'text'
//                                                     : 'password'
//                                             }
//                                         />
//                                         <InputAsterisk
//                                             visible={!value}
//                                             className="top-2 left-[85px]"
//                                         />{' '}
//                                         <button
//                                             type="button"
//                                             onClick={() =>
//                                                 setShowPassword(!showPassword)
//                                             }
//                                             className="absolute top-5 right-3 -translate-y-1/2 transform text-black"
//                                         >
//                                             {showPassword ? (
//                                                 <Eye />
//                                             ) : (
//                                                 <SlashEye />
//                                             )}
//                                         </button>{' '}
//                                         <div className="mt-3">
//                                             {error?.message ? (
//                                                 <span className="text-orange-600">
//                                                     {error.message}
//                                                 </span>
//                                             ) : null}
//                                         </div>
//                                     </div>
//                                 </>
//                             );
//                         }}
//                     />

//                     <Controller
//                         name="confirmPassword"
//                         control={control}
//                         render={({
//                             field: { onChange, value },
//                             fieldState: { error },
//                         }) => {
//                             const hasError = !!error;
//                             return (
//                                 <>
//                                     <div className="relative">
//                                         <input
//                                             value={value}
//                                             onChange={onChange}
//                                             className={`input-default ${hasError ? 'border-orange-600' : ''}`}
//                                             placeholder="Confirm password"
//                                             type={
//                                                 showConfirmPassword
//                                                     ? 'text'
//                                                     : 'password'
//                                             }
//                                         />
//                                         <InputAsterisk
//                                             visible={!value}
//                                             className="top-2 left-[145px]"
//                                         />{' '}
//                                         <button
//                                             type="button"
//                                             onClick={() =>
//                                                 setShowConfirmPassword(
//                                                     !showConfirmPassword,
//                                                 )
//                                             }
//                                             className="absolute top-5 right-3 -translate-y-1/2 transform text-black"
//                                         >
//                                             {showConfirmPassword ? (
//                                                 <Eye />
//                                             ) : (
//                                                 <SlashEye />
//                                             )}
//                                         </button>
//                                         {error?.message ? (
//                                             <div className="mt-3">
//                                                 <span className="text-orange-600">
//                                                     {error.message}
//                                                 </span>
//                                             </div>
//                                         ) : null}
//                                     </div>
//                                 </>
//                             );
//                         }}
//                     />
//                     <div className="mt-5 flex flex-col justify-center gap-6">
//                         <button
//                             type="submit"
//                             className="font-poppins flex h-[41px] items-center justify-center rounded-[10px] bg-orange-600 text-[14px] leading-[100%] font-normal text-white"
//                         >
//                             Register
//                         </button>

//                         <div className="flex items-center justify-center gap-2">
//                             <p className="font-poppins text-sm leading-[100%] font-normal tracking-[0px] text-zinc-700">
//                                 Already member?
//                             </p>

//                             <Link to={`/auth/login`}>
//                                 <button>
//                                     <span className="font-poppins text-sm leading-[100%] font-medium tracking-[0px] text-orange-600">
//                                         Log In
//                                     </span>
//                                 </button>
//                             </Link>
//                         </div>
//                     </div>
//                 </div>
//             </form>
//         </div>
//     );
// };
