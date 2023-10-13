export default function calculatePageRange(pagination) {
   const maxDisplayedPages = pagination.per_page;

   let startPage = Math.max(
      1,
      pagination.current_page - Math.floor(maxDisplayedPages / 2)
   );
   const endPage = Math.min(
      pagination.last_page,
      startPage + maxDisplayedPages - 1
   );

   if (endPage - startPage + 1 < maxDisplayedPages) {
      startPage = Math.max(1, endPage - maxDisplayedPages + 1);
   }

   return Array.from(
      { length: endPage - startPage + 1 },
      (_, index) => startPage + index
   );
}