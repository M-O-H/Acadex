import { InputHTMLAttributes, forwardRef, useId } from 'react';
import { clsx } from 'clsx';

export interface FileInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
}

export const FileInput = forwardRef<HTMLInputElement, FileInputProps>(
  ({ className, label, id: propId, ...props }, ref) => {
    const generatedId = useId();
    const id = propId || generatedId;

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={id} className="block text-sm font-medium mb-1">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={id}
          type="file"
          className={clsx(
            'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:mr-4 file:py-1 file:px-4 file:rounded-md file:border-0 file:bg-primary file:text-primary-foreground file:font-medium hover:file:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
            className
          )}
          {...props}
        />
      </div>
    );
  }
);

FileInput.displayName = 'FileInput';