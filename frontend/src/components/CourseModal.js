import React from 'react';
import { Badge, ListGroup, Row, Col, Table, Modal } from 'react-bootstrap';
import { SEARCH_AVERAGE_ACROSS_SEASONS } from '../queries/QueryStrings';
import { useQuery } from '@apollo/react-hooks';
import tagStyles from './SearchResultsItem.module.css';
import styles from './CourseModal.module.css';
import './CourseModal.css';
import { ratingColormap, workloadColormap } from '../queries/Constants.js';

const CourseModal = (props) => {
  const listing = props.listing;
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const toSeasonString = (season_code) => {
    const seasons = ['', 'Spring', 'Summer', 'Fall'];
    return (
      season_code.substring(0, 4) + ' ' + seasons[parseInt(season_code[5])]
    );
  };

  let location_url = '',
    location_name = 'TBD';
  for (let i in days) {
    const day = days[i];
    if (listing[`course.times_by_day.${day}`]) {
      location_url = listing[`course.times_by_day.${day}`][0][3];
      location_name = listing[`course.times_by_day.${day}`][0][2];
    }
  }

  const { loading, error, data } = useQuery(SEARCH_AVERAGE_ACROSS_SEASONS, {
    variables: {
      course_code: listing.course_code ? listing.course_code : 'bruh',
    },
  });
  if (loading || error) return <div>Loading...</div>;

  let evaluations = {};
  let items = [];

  if (data) {
    data.computed_course_info.forEach((season) => {
      evaluations[season.season_code] = [
        season.course.evaluation_statistics[0]
          ? season.course.evaluation_statistics[0].avg_rating
          : -1,
        season.course.evaluation_statistics[0]
          ? season.course.evaluation_statistics[0].avg_workload
          : -1,
      ];
    });

    for (let season in evaluations) {
      // console.log(evaluations[season]);
      if (evaluations[season][0] === -1 && evaluations[season][1] === -1)
        continue;
      items.push(
        <Row className="m-auto py-1 justify-content-center">
          <Col
            sm={5}
            className={
              styles.rating_bubble + ' d-flex justify-content-center px-0 mr-3'
            }
          >
            <strong>{toSeasonString(season)}</strong>
          </Col>
          <Col
            sm={2}
            style={
              evaluations[season][0] && {
                color: ratingColormap(evaluations[season][0]),
              }
            }
            className="px-0 d-flex justify-content-center"
          >
            <strong>
              {evaluations[season][0] != -1 &&
                evaluations[season][0].toFixed(1)}
            </strong>
          </Col>
          <Col
            sm={2}
            style={
              evaluations[season][1] && {
                color: workloadColormap(evaluations[season][1]),
              }
            }
            className="px-0 d-flex justify-content-center"
          >
            <strong>
              {evaluations[season][1] != -1 &&
                evaluations[season][1].toFixed(1)}
            </strong>
          </Col>
        </Row>
      );
    }
  }
  items.reverse();

  return (
    <div className="d-flex justify-content-center">
      <Modal
        show={props.show}
        scrollable={true}
        onHide={props.hideModal}
        dialogClassName="modal-custom-width"
        // size="lg"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>{listing['course.title']}</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Row className="m-auto">
            <Col sm={6} className="px-0 my-0">
              {/* COURSE DESCRIPTION */}
              <Row className="m-auto pb-3">{listing['course.description']}</Row>
              {listing['professors'] && (
                <Row className="m-auto py-2">
                  <Col sm={4} className="px-0">
                    <strong className={styles.lable_bubble}>Professor</strong>
                  </Col>
                  <Col sm={8}>{listing.professors}</Col>
                </Row>
              )}
              {(listing.skills || listing.areas) && (
                <Row className="m-auto py-2">
                  <Col sm={4} className="px-0">
                    <strong className={styles.lable_bubble}>
                      Skills/Areas
                    </strong>
                  </Col>
                  <Col sm={8}>
                    {!listing.skills || (
                      <Badge
                        variant="secondary"
                        className={
                          tagStyles.tag + ' ' + tagStyles[listing.skills]
                        }
                      >
                        {listing.skills}
                      </Badge>
                    )}
                    {!listing.areas || (
                      <Badge
                        variant="secondary"
                        className={
                          tagStyles.tag + ' ' + tagStyles[listing.areas]
                        }
                      >
                        {listing.areas}
                      </Badge>
                    )}
                  </Col>
                </Row>
              )}
              {listing['course.times_summary'] !== 'TBA' && (
                <Row className="m-auto py-2">
                  <Col sm={4} className="px-0">
                    <strong className={styles.lable_bubble}>Meets</strong>
                  </Col>
                  <Col sm={8}>{listing['course.times_summary']}</Col>
                </Row>
              )}
              {location_url !== '' && (
                <Row className="m-auto py-2">
                  <Col sm={4} className="px-0">
                    <strong className={styles.lable_bubble}>Location</strong>
                  </Col>
                  <Col sm={8}>
                    <a
                      target="_blank"
                      rel="noopener noreferrer"
                      href={location_url}
                    >
                      {location_name}
                    </a>
                  </Col>
                </Row>
              )}
              {listing['course.syllabus_url'] && (
                <Row className="m-auto py-2">
                  <Col sm={4} className="px-0">
                    <strong className={styles.lable_bubble}>Syllabus</strong>
                  </Col>
                  <Col sm={8}>
                    <a
                      target="_blank"
                      rel="noopener noreferrer"
                      href={listing['course.syllabus_url']}
                    >
                      {listing['course_code']}
                    </a>
                  </Col>
                </Row>
              )}
            </Col>
            <Col sm={6} className="px-0 my-0">
              <Row className="m-auto justify-content-center">
                <strong>Evaluations</strong>
              </Row>
              <Row className="m-auto py-1 justify-content-center">
                <Col sm={5} className="d-flex justify-content-center px-0 mr-3">
                  <span className={styles.evaluation_header}>Season</span>
                </Col>
                <Col sm={2} className="d-flex justify-content-center px-0">
                  <span className={styles.evaluation_header}>R</span>
                </Col>
                <Col sm={2} className="d-flex justify-content-center px-0">
                  <span className={styles.evaluation_header}>W</span>
                </Col>
              </Row>
              {items}
            </Col>
          </Row>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default CourseModal;
