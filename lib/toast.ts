// lib/toast.ts - Toast utility functions
import { toast as sonnerToast } from 'sonner'

export const toast = {
  success: (message: string, description?: string) => {
    sonnerToast.success(message, {
      description,
    })
  },

  error: (message: string, description?: string) => {
    sonnerToast.error(message, {
      description,
    })
  },

  info: (message: string, description?: string) => {
    sonnerToast.info(message, {
      description,
    })
  },

  warning: (message: string, description?: string) => {
    sonnerToast.warning(message, {
      description,
    })
  },

  loading: (message: string) => {
    return sonnerToast.loading(message)
  },

  promise: <T,>(
    promise: Promise<T>,
    messages: {
      loading: string
      success: string | ((data: T) => string)
      error: string | ((error: any) => string)
    }
  ) => {
    return sonnerToast.promise(promise, messages)
  },
}

// Pre-made toast messages for common actions
export const toastMessages = {
  // Food operations
  foodAdded: () => toast.success('Food added successfully', 'You can now use this food in your meals'),
  foodUpdated: () => toast.success('Food updated', 'Your changes have been saved'),
  foodDeleted: () => toast.success('Food deleted', 'The food has been removed'),
  
  // Meal operations
  mealLogged: (grade: string) => toast.success(`Meal logged successfully`, `Grade: ${grade}`),
  mealUpdated: () => toast.success('Meal updated', 'Your changes have been saved'),
  mealDeleted: () => toast.success('Meal deleted', 'The meal has been removed'),
  
  // Profile operations
  profileUpdated: () => toast.success('Profile updated', 'Your changes have been saved'),
  
  // Auth operations
  loginSuccess: (name: string) => toast.success(`Welcome back, ${name}!`),
  logoutSuccess: () => toast.success('Logged out', 'See you next time!'),
  signupSuccess: (name: string) => toast.success(`Welcome, ${name}!`, 'Your account has been created'),
  
  // Errors
  error: (message?: string) => toast.error('Oops!', message || 'Something went wrong. Please try again.'),
  networkError: () => toast.error('Network error', 'Please check your internet connection'),
  validationError: (field: string) => toast.error('Invalid input', `Please check your ${field}`),
  
  // Info
  copied: () => toast.success('Copied to clipboard'),
  saved: () => toast.success('Saved'),
  deleted: () => toast.success('Deleted'),
}