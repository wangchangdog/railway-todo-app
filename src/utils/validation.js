import { isPast } from 'date-fns';

export const validateDateTimeLocal = (value) => {
  if (!value) return true;
  return !isPast(new Date(value)) || 'Cannot be in the past';
};

export const titleValidation = {
  required: 'Title is required.',
  maxLength: {
    value: 50,
    message: 'Title must be 50 characters or less.',
  },
};

export const detailValidation = {
  maxLength: {
    value: 1000,
    message: 'Description must be 1000 characters or less.',
  },
};