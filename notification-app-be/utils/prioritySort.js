const PRIORITY_MAP = {
  'placement': 1,  // highest priority
  'result': 2,
  'event': 3       // lowest priority
};

function sortByPriority(notifications) {
  return [...notifications].sort((a, b) => {
    const priorityA = PRIORITY_MAP[a.type?.toLowerCase()] || 99;
    const priorityB = PRIORITY_MAP[b.type?.toLowerCase()] || 99;
    
    if (priorityA !== priorityB) {
      return priorityA - priorityB; // lower number = higher priority
    }
    
    // Same priority: sort by recency (newest first)
    const timeA = new Date(a.timestamp || a.createdAt || a.date || 0).getTime();
    const timeB = new Date(b.timestamp || b.createdAt || b.date || 0).getTime();
    
    return timeB - timeA;
  });
}

function paginate(items, page = 1, limit = 10) {
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  return {
    data: items.slice(startIndex, endIndex),
    pagination: {
      currentPage: page,
      totalPages: Math.ceil(items.length / limit),
      totalItems: items.length,
      itemsPerPage: limit,
      hasNext: endIndex < items.length,
      hasPrev: page > 1
    }
  };
}

module.exports = { sortByPriority, paginate, PRIORITY_MAP };
