'use client';

import Request from './Request';

const RequestColumn = ({ title, requests, isIncoming, onStatusChange, onDelete, emptyMessage }) => {
    return (
        <div>
            <h2 className="text-2xl font-bold mb-4 uppercase border-b-4 border-black pb-2" style={{ fontFamily: 'monospace' }}>
                {title}
            </h2>
            {requests.length === 0 ? (
                <p className="text-gray-600 font-mono">{emptyMessage || `No ${title.toLowerCase()} yet.`}</p>
            ) : (
                <div className="space-y-4">
                    {requests.map((request) => (
                        <Request
                            key={request.id}
                            request={request}
                            isIncoming={isIncoming}
                            onStatusChange={onStatusChange}
                            onDelete={onDelete}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default RequestColumn; 