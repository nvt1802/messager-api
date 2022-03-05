const getPagination = (page, size) => {
  const limit = size ? +size : 3
  const offset = page - 1 ? (page - 1) * limit : 0
  return { limit, offset }
}

const getPagingData = (data, totalItems, page, limit) => {
  const currentPage = page ? +page : 0
  const totalPages = Math.ceil(totalItems / limit)
  return {
    payload: data,
    totalItems,
    totalPages,
    currentPage,
    limit: Number(limit),
  }
}

module.exports = {
  getPagination,
  getPagingData,
}
