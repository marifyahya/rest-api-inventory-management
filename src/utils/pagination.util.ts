/**
 * Calculates the skip and take values for database pagination.
 * 
 * @param {number} page - The current page number (starts from 1).
 * @param {number} limit - The number of items per page.
 * @returns {{ skip: number, take: number }} An object containing skip and take values.
 */
export const paginate = (page: number, limit: number) => {
  const skip = (page - 1) * limit;
  return { skip, take: limit };
};

/**
 * Generates pagination metadata.
 * 
 * @param {number} total - The total number of items.
 * @param {number} page - The current page number.
 * @param {number} limit - The number of items per page.
 * @returns {{ currentPage: number, lastPage: number, perPage: number, total: number }} Pagination metadata.
 */
export const paginationMeta = (total: number, page: number, limit: number) => {
  const lastPage = Math.ceil(total / limit);
  return {
    currentPage: page,
    lastPage,
    perPage: limit,
    total,
  };
};
