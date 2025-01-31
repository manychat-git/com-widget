import { Node } from './types';

interface InfoPanelProps {
  selectedNode: Node | null;
  onClose: () => void;
}

const InfoPanel = ({ selectedNode, onClose }: InfoPanelProps) => {
  if (!selectedNode) return null;

  // Разделяем теги, если они есть
  const tags = selectedNode.tags ? selectedNode.tags.split(';').map(tag => tag.trim()) : [];

  return (
    <div className="fixed right-0 top-0 h-full w-80 bg-white/90 backdrop-blur-sm shadow-lg p-6 transform transition-transform duration-300 ease-in-out overflow-y-auto">
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-xl"
      >
        ×
      </button>
      
      <div className="mt-8 space-y-4">
        {/* Изображение */}
        {selectedNode.imageUrl && (
          <img 
            src={selectedNode.imageUrl} 
            alt={selectedNode.title}
            className="rounded-lg shadow-sm w-full object-cover aspect-video mb-4"
          />
        )}

        {/* Заголовок */}
        <h2 className="text-xl font-semibold">{selectedNode.title}</h2>
        
        {/* Автор */}
        {selectedNode.author && (
          <div className="text-sm text-gray-600">
            by <span className="font-medium">{selectedNode.author}</span>
          </div>
        )}

        {/* Теги */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {tags.map((tag, index) => (
              <span
                key={index}
                className="inline-block px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Тип контента */}
        <span className={`inline-block px-2 py-1 rounded-full text-xs
          ${selectedNode.type === 'article' ? 'bg-blue-100 text-blue-800' : ''}
          ${selectedNode.type === 'youtube_video' ? 'bg-pink-100 text-pink-800' : ''}
          ${selectedNode.type === 'special_project' ? 'bg-orange-100 text-orange-800' : ''}
          ${selectedNode.type === 'meme' ? 'bg-purple-100 text-purple-800' : ''}
        `}>
          {selectedNode.type}
        </span>
        
        {/* Описание */}
        {selectedNode.description && (
          <p className="text-gray-600 text-sm leading-relaxed">
            {selectedNode.description}
          </p>
        )}
      </div>
    </div>
  );
};

export default InfoPanel;