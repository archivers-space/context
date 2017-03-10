import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';

import { selectUrl, selectOutboundLinks, selectInboundLinks, urlStats } from '../selectors/url';
import { loadUrl, loadOutboundLinks, loadInboundLinks, archiveUrl } from '../actions/url';

import List from '../components/List';
import NotFound from '../components/NotFound';
import SnapshotItem from '../components/item/SnapshotItem';
import Spinner from '../components/Spinner';
import StatsBar from '../components/StatsBar';
import UrlItem from '../components/item/UrlItem';
import TabBar from '../components/TabBar';

class Url extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: !!props.url,
      tab: 'outbound links',
    };

    [
      'handleArchive',
      'handleChangeTab',
    ].forEach((m) => { this[m] = this[m].bind(this); });
  }

  componentWillMount() {
    this.props.loadUrl(this.props.urlParam);
    this.props.loadOutboundLinks(this.props.urlParam);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.urlParam != this.props.urlParam) {
      this.props.loadUrl(nextProps.urlParam);
      this.props.loadOutboundLinks(this.props.urlParam);
      this.setState({ loading: true });
    } if (nextProps.url && this.state.loading) {
      this.setState({ loading: false });
    }
  }

  handleArchive() {
    this.props.archiveUrl(this.props.url.url);
  }

  handleChangeTab(tab) {
    const { urlParam } = this.props;
    switch (tab) {
      case "outbound links":
        this.props.loadOutboundLinks(urlParam);
        break;
      case "inbound links":
        this.props.loadInboundLinks(urlParam);
        break;
      case "snapshots":
        break;
      default:
        break;
    }
    this.setState({ tab });
  }

  renderCurrentTab() {
    const { tab } = this.state;
    switch (tab) {
      case "outbound links":
        return <List data={this.props.outboundLinks} component={UrlItem} />;
      case "inbound links":
        return <List data={this.props.inboundLinks} component={UrlItem} />;
      case "snapshots":
        return <List data={this.props.snapshots} component={SnapshotItem} />;
      default:
        return undefined;
    }
  }

  renderContent() {
    const { url } = this.props;
    const { tab } = this.state;

    if (url.contentSniff != "text/html; charset=utf-8") {
      return (
        <div className="row">
          <div className="col-md-12">
            <hr className="green" />
            <label>Content</label>
            <Link to={`/content/${url.hash}`}>{url.hash}</Link>
          </div>
        </div>
      );
    }

    return (
      <div>
        <TabBar value={tab} tabs={["outbound links", "inbound links", "snapshots"]} onChange={this.handleChangeTab} />
        <div className="row">
          {this.renderCurrentTab()}
        </div>
      </div>
    );
  }

  render() {
    const { url } = this.props;
    const { loading } = this.state;

    if (loading) {
      return <Spinner />;
    } else if (!url) {
      return <NotFound />;
    }

    return (
      <div className="container">
        <header className="row">
          <div className="col-md-12">
            <hr className="green" />
            <label>URL</label>
            <h3>{url.url}</h3>
            {url.hash ? undefined : <button className="btn btn-primary" onClick={this.handleArchive}>Archive Url</button>}
            <hr className="green" />
          </div>
        </header>
        <StatsBar stats={urlStats(url)} />
        {this.renderContent()}
      </div>
    );
  }
}

Url.propTypes = {
  url: PropTypes.object,
  loadUrl: PropTypes.func.isRequired,
  outboundLinks: PropTypes.array,
  inboundLinks: PropTypes.array,
  snapshots: PropTypes.array,
};

function mapStateToProps(state, ownProps) {
  const urlParam = ownProps.location.query.url;

  return Object.assign({
    // user : selectLocalSessionUser(state),
    urlParam,
    url: selectUrl(state, urlParam),
    outboundLinks: selectOutboundLinks(state, urlParam),
    inboundLinks: selectInboundLinks(state, urlParam),
  }, ownProps);
}

export default connect(mapStateToProps, {
  loadUrl,
  loadOutboundLinks,
  loadInboundLinks,
  archiveUrl,
})(Url);