export function formatZodError(error) {
    return error.issues.reduce((acc, error) => {
      const field = error.path[0];
      acc[field] = error.message;
      return acc;
    }, {});
  }