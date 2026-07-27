import { Leaf, Sprout } from 'lucide-react';

export default function AmbientBotanicalMotion() {
  return (
    <div className="pointer-events-none fixed inset-0 z-20 overflow-hidden" aria-hidden="true">
      <div className="ambient-orb ambient-orb-one" />
      <div className="ambient-orb ambient-orb-two" />
      <Leaf className="ambient-leaf ambient-leaf-one" />
      <Sprout className="ambient-leaf ambient-leaf-two" />
      <Leaf className="ambient-leaf ambient-leaf-three" />
    </div>
  );
}
