import { Node } from './types';

interface InfoPanelProps {
  selectedNode: Node | null;
  onClose: () => void;
}

const InfoPanel = ({ selectedNode, onClose }: InfoPanelProps) => {
  if (!selectedNode) return null;

  return (
    <div className="fixed right-0 top-0 h-full w-80 bg-white/90 backdrop-blur-sm shadow-lg p-6 transform transition-transform duration-300 ease-in-out">
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
      >
        ×
      </button>
      
      <div className="mt-8">
        <span className={`inline-block px-2 py-1 rounded-full text-sm mb-4
          ${selectedNode.type === 'article' ? 'bg-blue-100 text-blue-800' : ''}
          ${selectedNode.type === 'author' ? 'bg-emerald-100 text-emerald-800' : ''}
          ${selectedNode.type === 'topic' ? 'bg-red-100 text-red-800' : ''}
          ${selectedNode.type === 'meme' ? 'bg-orange-100 text-orange-800' : ''}
        `}>
          {selectedNode.type}
        </span>
        
        <h2 className="text-xl font-semibold mb-2">{selectedNode.title}</h2>
        
        {selectedNode.description && (
          <p className="text-gray-600 mb-4">{selectedNode.description}</p>
        )}
        
        {selectedNode.imageUrl && (
          <img 
            src={selectedNode.imageUrl} 
            alt={selectedNode.title}
            className="rounded-lg shadow-sm w-full object-cover mb-4"
          />
        )}
      </div>
    </div>
  );
};

export default InfoPanel;