import { twd, type CartItem } from '@/lib/cart';

export default function CartItemRow({
  item,
  onInc,
  onDec,
  onRemove,
}: {
  item: CartItem;
  onInc: () => void;
  onDec: () => void;
  onRemove: () => void;
}) {
  return (
    <article className="bg-white rounded-2xl p-5 flex flex-col md:flex-row md:items-center gap-4">
      <div className="flex-1">
        <p className="text-xs text-secondary font-bold">{item.category || '商品'}</p>
        <h4 className="text-lg font-black text-primary">{item.name}</h4>
        {item.size && <p className="text-sm text-gray-500">規格：{item.size}</p>}
        <p className="text-sm text-gray-500">單價：{twd(item.price)}</p>
      </div>
      <div className="flex items-center gap-2">
        <button onClick={onDec} className="w-8 h-8 rounded-full border border-gray-300">
          -
        </button>
        <span className="w-8 text-center font-bold">{item.qty}</span>
        <button onClick={onInc} className="w-8 h-8 rounded-full border border-gray-300">
          +
        </button>
      </div>
      <div className="text-right min-w-28">
        <p className="font-black text-primary">{twd(item.price * item.qty)}</p>
        <button onClick={onRemove} className="text-sm text-red-500 mt-1">
          移除
        </button>
      </div>
    </article>
  );
}
