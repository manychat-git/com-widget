import { Node } from './types';

// Функция для форматирования имени автора
const formatAuthorName = (author: string): string => {
  return author
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

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
        {/* Теги и тип контента */}
        <div className="flex flex-wrap gap-2">
          {/* Тип контента */}
          <span className={`inline-block px-2 py-1 rounded-sm text-xs text-white font-medium cofo-sans-mono
            ${selectedNode.type === 'article' ? 'bg-[#0057FF]' : ''}
            ${selectedNode.type === 'youtube_video' ? 'bg-[#FD00FD]' : ''}
            ${selectedNode.type === 'special_project' ? 'bg-[#FF4B00]' : ''}
          `}>
            {selectedNode.type.toUpperCase()}
          </span>
          
          {/* Остальные теги */}
          {tags.length > 0 && tags.map((tag, index) => (
            <span
              key={index}
              className="inline-block px-2 py-1 bg-gray-800 text-white rounded-sm text-xs font-medium cofo-sans-mono"
            >
              {tag.toUpperCase()}
            </span>
          ))}
        </div>

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
        
        {/* Дескриптор */}
        {selectedNode.descriptor && (
          <div className="text-sm text-gray-500 cofo-sans-mono">
            {selectedNode.descriptor}
          </div>
        )}

        {/* Автор */}
        {selectedNode.author && (
          <div className="text-sm text-gray-600">
            by <span className="font-medium">{formatAuthorName(selectedNode.author)}</span>
          </div>
        )}
        
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