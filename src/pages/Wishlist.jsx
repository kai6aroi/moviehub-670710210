import MovieGrid from '../components/MovieGrid';
import { useAuth } from '../auth/AuthContext';
import { useEffect, useState } from 'react';
import { getWishlist } from '../api/backend';

function Wishlist() {
  // 1. ดึงทั้ง member และ token ออกมาจาก useAuth()
  const { member, token } = useAuth();

  // 2. เปลี่ยนค่าคงที่เป็น State
  const [movies, setMovies] = useState([]);
  const [status, setStatus] = useState('loading');
  const [error, setError] = useState(null);

  // 3. ใช้ useEffect เพื่อดึงข้อมูล wishlist เมื่อมี token
  useEffect(() => {
    const fetchWishlist = async () => {
      if (!token) return;

      try {
        setStatus('loading');
        setError(null);

        const data = await getWishlist(token); // ได้ส่งกลับมาเป็น { items: [...] }
        setMovies(data.items || []);
        setStatus('success');
      } catch (err) {
        setError(err.message || 'ไม่สามารถโหลดรายการที่อยากดูได้');
        setStatus('error');
      }
    };

    fetchWishlist();
  }, [token]);

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 md:px-6">
      <h1 className="text-2xl font-semibold text-slate-900">
        รายการที่อยากดูของ {member?.displayName}
      </h1>
      <p className="mb-6 text-sm text-slate-500">
        กดปุ่มหัวใจในหน้าหนังเพื่อเพิ่มเรื่องเข้ามาที่นี่
      </p>
      <MovieGrid movies={movies} status={status} error={error} />
    </div>
  );
}

export default Wishlist;