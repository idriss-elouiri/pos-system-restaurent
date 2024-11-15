import { useMemo } from 'react';

export default function NotFoundPage({ data }) {
  const memoizedData = useMemo(() => data || {}, [data]);

  if (!memoizedData) {
    return <div>No Data Found</div>;
  }

  return <div>{memoizedData.content}</div>;
}
