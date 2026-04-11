import { useEffect, useMemo, useState } from 'react';
import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import adminCarteService from '../../services/admin-carte.service';
import './AdminCartePage.css';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const MapFocusController = ({ target }) => {
  const map = useMap();

  useEffect(() => {
    if (!target || !Array.isArray(target) || target.length !== 2) return;
    map.flyTo(target, 13, { duration: 0.7 });
  }, [map, target]);

  return null;
};

const monthLabel = (value) => {
  const months = ['Jan', 'Fev', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Aou', 'Sep', 'Oct', 'Nov', 'Dec'];
  return months[value - 1] || '';
};

const statusBadgeClass = (status) => {
  const val = String(status || '').toLowerCase();
  if (val === 'ouverte') return 'is-open';
  if (val === 'fermee' || val === 'fermée') return 'is-closed';
  return 'is-ended';
};

const AdminCartePage = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selected, setSelected] = useState(null);
  const [filterStatus, setFilterStatus] = useState('');
  const [filterMonth, setFilterMonth] = useState('');
  const [filterSearch, setFilterSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalActivity, setModalActivity] = useState(null);
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [saving, setSaving] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);
      setError('');
      const [mapDataRaw, allRaw] = await Promise.all([
        adminCarteService.getMapData().catch(() => ({ activites: [] })),
        adminCarteService.getOpenActivities(),
      ]);

      const mapById = new Map((mapDataRaw.activites || []).map((item) => [String(item.id), item]));
      const unified = (allRaw || []).map((item) => {
        const key = String(item.id_activite);
        const adminData = mapById.get(key);

        return {
          id: key,
          titre: item.titre_activite || adminData?.titre || 'Activite',
          lieu: item.lieu_activite || adminData?.lieu || 'Lieu non renseigne',
          statut: item.statut || adminData?.statut || 'terminee',
          dateRaw: item.date_heure_activite || null,
          dateLabel: adminData?.date || (item.date_heure_activite ? new Date(item.date_heure_activite).toLocaleString('fr-FR') : 'Date inconnue'),
          latitude: adminData?.latitude ?? (item.latitude_activite ? Number(item.latitude_activite) : null),
          longitude: adminData?.longitude ?? (item.longitude_activite ? Number(item.longitude_activite) : null),
          capacite: item.capacite || adminData?.capacite || null,
        };
      });

      setActivities(unified);
    } catch (err) {
      setError(err.message || 'Erreur pendant le chargement de la carte.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const filteredActivities = useMemo(() => {
    return activities.filter((item) => {
      const okStatus = !filterStatus || String(item.statut).toLowerCase() === filterStatus;
      const month = item.dateRaw ? String(new Date(item.dateRaw).getMonth() + 1) : '';
      const okMonth = !filterMonth || month === filterMonth;
      const search = filterSearch.trim().toLowerCase();
      const okSearch = !search || item.titre.toLowerCase().includes(search) || item.lieu.toLowerCase().includes(search);
      return okStatus && okMonth && okSearch;
    });
  }, [activities, filterMonth, filterSearch, filterStatus]);

  const withCoords = filteredActivities.filter((a) => Number.isFinite(a.latitude) && Number.isFinite(a.longitude));
  const withoutCoords = filteredActivities.length - withCoords.length;
  const currentMonthCount = filteredActivities.filter((a) => a.dateRaw && (new Date(a.dateRaw).getMonth() + 1) === (new Date().getMonth() + 1)).length;

  const centerTarget = selected && Number.isFinite(selected.latitude) && Number.isFinite(selected.longitude)
    ? [selected.latitude, selected.longitude]
    : null;

  const openCoordinatesModal = (activity) => {
    setModalActivity(activity);
    setLatitude(activity.latitude ?? '');
    setLongitude(activity.longitude ?? '');
    setIsModalOpen(true);
  };

  const saveCoordinates = async () => {
    if (!modalActivity) return;
    try {
      setSaving(true);
      await adminCarteService.updateCoordinates(modalActivity.id, Number(latitude), Number(longitude));
      setIsModalOpen(false);
      await loadData();
    } catch (err) {
      alert(err.message || 'Erreur lors de la sauvegarde.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="admin-carte-page">
      <header className="admin-carte-header">
        <div>
          <p className="kicker">Carte des activites</p>
          <h1>Suivi geographique des activites</h1>
        </div>
        <button className="btn-primary" onClick={loadData} disabled={loading}>Rafraichir</button>
      </header>

      {error && <div className="error-banner">{error}</div>}

      <section className="stats-grid">
        <article><span>Total</span><strong>{filteredActivities.length}</strong></article>
        <article><span>Geolocalisees</span><strong>{withCoords.length}</strong></article>
        <article><span>Sans position</span><strong>{withoutCoords}</strong></article>
        <article><span>Ce mois</span><strong>{currentMonthCount}</strong></article>
      </section>

      <section className="filters-card">
        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
          <option value="">Tous les statuts</option>
          <option value="ouverte">Ouverte</option>
          <option value="fermee">Fermee</option>
          <option value="fermée">Fermee</option>
          <option value="terminee">Terminee</option>
        </select>
        <select value={filterMonth} onChange={(e) => setFilterMonth(e.target.value)}>
          <option value="">Tous les mois</option>
          {Array.from({ length: 12 }, (_, i) => (
            <option key={i + 1} value={String(i + 1)}>{monthLabel(i + 1)}</option>
          ))}
        </select>
        <input
          type="text"
          placeholder="Rechercher une activite..."
          value={filterSearch}
          onChange={(e) => setFilterSearch(e.target.value)}
        />
      </section>

      <section className="content-grid">
        <div className="map-card">
          <MapContainer center={[-18.8792, 47.5079]} zoom={6} className="leaflet-map">
            <MapFocusController target={centerTarget} />
            <TileLayer
              attribution="&copy; OpenStreetMap contributors"
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {withCoords.map((activity) => (
              <Marker key={activity.id} position={[activity.latitude, activity.longitude]}>
                <Popup>
                  <div className="popup-shell">
                    <h4>{activity.titre}</h4>
                    <p>{activity.lieu}</p>
                    <p>{activity.dateLabel}</p>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>

        <aside className="activities-card">
          <h3>Activites</h3>
          <div className="activity-list">
            {filteredActivities.map((activity) => (
              <article key={activity.id} className="activity-item">
                <div>
                  <h4>{activity.titre}</h4>
                  <p>{activity.lieu}</p>
                  <span className={`status-badge ${statusBadgeClass(activity.statut)}`}>{activity.statut}</span>
                </div>
                {Number.isFinite(activity.latitude) && Number.isFinite(activity.longitude) ? (
                  <button className="btn-outline" onClick={() => setSelected(activity)}>Localiser</button>
                ) : (
                  <button className="btn-outline warn" onClick={() => openCoordinatesModal(activity)}>Ajouter coordonnees</button>
                )}
              </article>
            ))}
            {filteredActivities.length === 0 && <p className="empty-state">Aucune activite trouvee.</p>}
          </div>
        </aside>
      </section>

      {isModalOpen && (
        <div className="modal-overlay" onClick={() => !saving && setIsModalOpen(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <h4>Mettre a jour les coordonnees</h4>
            <p>{modalActivity?.titre}</p>
            <label>
              Latitude
              <input type="number" step="0.000001" value={latitude} onChange={(e) => setLatitude(e.target.value)} />
            </label>
            <label>
              Longitude
              <input type="number" step="0.000001" value={longitude} onChange={(e) => setLongitude(e.target.value)} />
            </label>
            <div className="modal-actions">
              <button className="btn-outline" onClick={() => setIsModalOpen(false)} disabled={saving}>Annuler</button>
              <button className="btn-primary" onClick={saveCoordinates} disabled={saving}>{saving ? 'Enregistrement...' : 'Enregistrer'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCartePage;
